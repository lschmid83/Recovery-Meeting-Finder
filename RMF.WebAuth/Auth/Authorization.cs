using RMF.WebAuth.Enums;

namespace RMF.WebAuth.Auth
{
    public class Authorization
    {
        public static bool IsActionPublic(UserType actionPermissions)
        {
            if (actionPermissions == UserType.None)
                return true;
            else
                return false;
        }

        public static bool IsUserTypeAuthorized(UserType userPermissions, UserType actionPermissions)
        {
            if ((userPermissions & actionPermissions) == 0)
                return false;
            else
                return true;
        }
    }
}
