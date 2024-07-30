using System;

namespace RMF.WebAuth.Enums
{
    [Flags]
    public enum UserType
    {
        None = 0,
        ApiUser = 1,
        WebsiteUser = 2
    }
}
