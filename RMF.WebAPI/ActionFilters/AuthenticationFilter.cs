using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;
using Microsoft.AspNetCore.Http;
using RMF.DAL.Repos.Interfaces;
using RMF.DAL.Entities;
using RMF.WebAuth.Auth;
using System.Threading.Tasks;
using System.Web;
using System.Linq;

namespace RMF.WebAPI.ActionFilters
{
    public class AuthenticationFilter : IAsyncActionFilter
    {
        private IUserRepo UserRepo { get; set; }

        public AuthenticationFilter(IUserRepo userRepo)
        {
            UserRepo = userRepo;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Get request headers.
            var username = context.HttpContext.Request.Headers["User"].ToString();
            var hash = context.HttpContext.Request.Headers["Hash"].ToString();
            var timestamp = context.HttpContext.Request.Headers["Timestamp"].ToString();
            var method = context.HttpContext.Request.Path + context.HttpContext.Request.QueryString;
            method = HttpUtility.UrlDecode(method);

            // Get user from database.
            var user = await UserRepo.Get(username);

            // Check user credentials.
            if (user != null && AuthenticateUser(user, method, timestamp, hash))
            {
                // Add user to HttpContext.
                context.HttpContext.Items.Add("User", user);
            }
        
            await next(); // the actual action
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        private bool AuthenticateUser(User user, string method, string timestamp, string hash)
        {
            var expectedHash = Authentication.GetHash(user.Password + method + timestamp);  
            if (hash == expectedHash)
                return true;
            else
                return false;
        }
    }
}
