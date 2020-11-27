using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace AppSupport.Web.Hubs
{
    public class SyncHub : Hub
    {
        public async Task triggerSync() => await Clients.All.SendAsync("sync");
        public async Task triggerBranch(int id) => await Clients.All.SendAsync("syncBranch", id);
        public async Task triggerOrganization(int id) => await Clients.All.SendAsync("syncOrganization", id);
        public async Task triggerPerson(int id) => await Clients.All.SendAsync("syncPerson", id);
        public async Task triggerPlane(int id) => await Clients.All.SendAsync("syncPlane", id);
        public async Task triggerRank(int id) => await Clients.All.SendAsync("syncRank", id);
        public async Task triggerTemplate(int id) => await Clients.All.SendAsync("syncTemplate", id);
        public async Task triggerManifest(int id) => await Clients.All.SendAsync("syncManifest", id);
    }
}