using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace AppSupport.Core.ApiQuery
{
    public static class QueryableProcessor
    {
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> queryable, QueryOptions options)
        {
            if (queryable == null)
            {
                throw new ArgumentNullException(nameof(queryable));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            if (string.IsNullOrWhiteSpace(options.SortProperty))
            {
                return queryable;
            }

            var orderMethodName = options.SortDescending
                ? nameof(Queryable.OrderByDescending)
                : nameof(Queryable.OrderBy);

            var result = ApplySorting(queryable, orderMethodName, options.SortProperty);

            return result;
        }

        static IQueryable<T> ApplySorting<T>(IQueryable<T> queryable, string sortMethodName, string propertyName)
        {
            var orderingProperty = GetPropertyInfoRecursively(queryable, propertyName);

            if (orderingProperty.declaringType == null || orderingProperty.property == null)
                return queryable;

            var orderByExp = CreateExpression(orderingProperty.declaringType, propertyName);

            if (orderByExp == null)
                return queryable;

            queryable = queryable.WrapInNullChecksIfAccessingNestedProperties(propertyName);

            var wrappedExpression = Expression.Call(
                typeof(Queryable),
                sortMethodName,
                new[] { orderingProperty.declaringType, orderingProperty.property.PropertyType },
                queryable.Expression,
                Expression.Quote(orderByExp)
            );

            var result = queryable.Provider.CreateQuery(wrappedExpression);

            return result.Cast<T>();
        }

        static (Type declaringType, PropertyInfo property) GetPropertyInfoRecursively<T>(this IQueryable<T> queryable, string propName)
        {
            var nameParts = propName.Split('.');

            if (nameParts.Length == 1)
            {
                var property = queryable.ElementType
                    .GetTypeInfo()
                    .GetProperty(CamelizeString(propName))
                ?? queryable.ElementType
                    .GetTypeInfo()
                    .GetProperty(propName);

                return (property?.DeclaringType, property);
            }

            var propertyInfo = queryable.ElementType
                .GetTypeInfo()
                .GetProperty(CamelizeString(nameParts[0]))
            ?? queryable.ElementType
                .GetTypeInfo()
                .GetProperty(nameParts[0]);

            if (propertyInfo == null)
            {
                return (null, null);
            }

            var originalDeclaringType = propertyInfo.DeclaringType;

            for (var i = 1; i < nameParts.Length; i++)
            {
                propertyInfo = propertyInfo.PropertyType
                    .GetProperty(CamelizeString(nameParts[i]))
                ?? propertyInfo.PropertyType
                    .GetProperty(nameParts[i]);

                if (propertyInfo == null)
                {
                    return (null, null);
                }
            }

            return (originalDeclaringType, propertyInfo);
        }

        static LambdaExpression CreateExpression(Type type, string propertyName)
        {
            var param = Expression.Parameter(type, "v");
            Expression body = param;

            foreach (var member in propertyName.Split('.'))
            {
                body = Expression.PropertyOrField(body, CamelizeString(member))
                    ?? Expression.PropertyOrField(body, member);
            }

            return Expression.Lambda(body, param);
        }

        static IQueryable<T> WrapInNullChecksIfAccessingNestedProperties<T>(this IQueryable<T> queryable, string propertyName)
        {
            var members = propertyName.Split('.');

            if (members.Length == 1)
            {
                return queryable;
            }

            for (var i = 0; i < members.Length - 1; i++)
            {
                var member = members[i];
                var param = Expression.Parameter(typeof(T), "v");
                Expression body = param;

                for (var j = 0; j <= i; j++)
                    body = Expression.PropertyOrField(body, CamelizeString(members[j]))
                        ?? Expression.PropertyOrField(body, members[j]);

                var memberPath = members
                    .TakeWhile((mem, index) => index <= i)
                    .Aggregate((c, n) => c + "." + n);

                var notNullExpression = Expression.NotEqual(body, Expression.Constant(null));
                var notNullLambda = Expression.Lambda(notNullExpression, param);
                var whereMethodName = nameof(Queryable.Where);

                var nullCheckExpression = Expression.Call(
                    typeof(Queryable),
                    whereMethodName,
                    new[] { typeof(T) },
                    queryable.Expression,
                    Expression.Quote(notNullLambda)
                );

                queryable.Provider.CreateQuery(nullCheckExpression);
            }

            return queryable;
        }

        static string CamelizeString(string camelCase) =>
            camelCase.Substring(0, 1).ToUpperInvariant() + camelCase.Substring(1);
    }
}
