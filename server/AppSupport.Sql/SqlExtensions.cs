using System;
using System.Data;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Linq;

namespace SqlCore
{
    public static class SqlExtensions
    {
        static string Interpolate(this string script, string prop) =>
            script.Replace(
                $"[{prop.Split(':')[0].ToLower()}]",
                prop.Split(':')[1]
            );

        public static string InterpolateScriptProps(this string script, string props)
        {
            string result = script;

            if (props.Contains(','))
            {
                foreach (var prop in props.Split(','))
                {
                    if (prop.Contains(':'))
                    {
                        result = result.Interpolate(prop);
                    }
                }
            }
            else if (props.Contains(':'))
            {
                result = result.Interpolate(props);
            }

            return result;
        }

        public static string BuildConnectionString(this string server, string database, int retry = 3, int retryInterval = 10)
        {
            var builder = new SqlConnectionStringBuilder();
            builder.DataSource = server;
            builder.InitialCatalog = database;
            builder.IntegratedSecurity = true;
            builder.ConnectRetryCount = retry;
            builder.ConnectRetryInterval = retryInterval;

            return builder.ConnectionString;
        }
        public static async Task<SqlConnection> InitalizeConnection(this string connectionString)
        {
            var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            return connection;
        }

        public static SqlCommand InitializeCommand(this SqlConnection connection, string script)
        {
            var command = new SqlCommand();
            command.Connection = connection;
            command.CommandType = CommandType.Text;
            command.CommandText = script;

            return command;
        }

        public static async Task<SqlDataReader> ResilientQuery(this SqlCommand command)
        {
            var succeeded = false;
            var retries = 4;
            var retryInterval = 2;
            SqlDataReader reader = null;

            for (var tries = 1; tries <= retries; tries++)
            {
                try
                {
                    if (tries > 1)
                    {
                        Console.WriteLine($"Transient error encountered. Will begin attempt number {tries} of {retries}.");
                        await Task.Delay(1000 * retryInterval);
                        retryInterval = Convert.ToInt32(retryInterval * 1.5);
                    }

                    reader = await command.ExecuteReaderAsync();
                    succeeded = true;
                    break;
                }
                catch (SqlException sqlEx)
                {
                    if (TransientErrorNumbers.Contains(sqlEx.Number) == true)
                    {
                        Console.WriteLine($"{sqlEx.Number}: transient occurred.");
                        continue;
                    }
                    else
                    {
                        Console.WriteLine(sqlEx);
                        succeeded = false;
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    succeeded = false;
                    break;
                }
            }

            if (succeeded)
            {
                return reader;
            }
            else
            {
                throw new Exception("An error occurred connecting to the database");
            }
        }

        public static async Task<JArray> ReadResults(this SqlDataReader reader)
        {
            var results = new JArray();

            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    var data = new JObject();

                    for (var i = 0; i < reader.VisibleFieldCount; i++)
                    {
                        var name = Char.ToLowerInvariant(reader.GetName(i)[0]) + reader.GetName(i).Substring(1);
                        var prop = new JProperty(name, reader.GetValue(i));
                        data.Add(prop);
                    }

                    results.Add(data);
                }
            }

            await reader.CloseAsync();

            return results;
        }

        static List<int> TransientErrorNumbers = new List<int>
        {
            4060, 40197, 40501, 40613, 49918, 49919, 49920, 11001
        };
    }
}
