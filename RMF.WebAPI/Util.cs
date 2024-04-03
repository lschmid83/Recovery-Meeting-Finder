using System;
using System.Text.RegularExpressions;

namespace RMF.WebAPI
{
    public class Util
    {
        public static Match IsValidEmail(string input)
        {
            if (input == null)
                return null;

            var emailRegex = new Regex("^[-a-zA-Z0-9_.]+@[-a-zA-Z0-9]+.[a-zA-Z]{2,4}$");
            var emailMatch = emailRegex.Match(input);

            return emailMatch;
        }

        public static bool IsValidTimeFormat(string input)
        {
            return TimeSpan.TryParse(input, out _);
        }

        public static bool IsValidInt(string input)
        {
            return int.TryParse(input, out _);
        }
    }
}
