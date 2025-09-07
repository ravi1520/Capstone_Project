using System.ComponentModel.DataAnnotations;

namespace FractoBackend.Models
{
    public class User
    {
        [Key] 
        public int Id { get; set; }

        
        public string Name { get; set; } = string.Empty;

        [Required] 
        [EmailAddress] 
        public string Email { get; set; } = string.Empty;

        [Required] 
        public string Password { get; set; } = string.Empty;

        [Required] 
        public string Role { get; set; } = "User"; // "User" or "Admin"
    }
}
