using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace RMF.WebAPI.Results
{
    public class UnauthorizedUser : JsonResult
    {
        public UnauthorizedUser() : base(new ErrorResult()
        {
            Message = "Unauthorized request",
            StatusCode = (int) HttpStatusCode.Unauthorized
        })
        {
        }
    }
}
