using Microsoft.AspNetCore.Mvc;
using FractoBackend.Data;
using FractoBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace FractoBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Register User
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (!ModelState.IsValid || user == null)
                return BadRequest(new { message = "Invalid registration request" });

            // Check if email already exists
            if (_context.Users.Any(u => u.Email == user.Email))
                return Conflict(new { message = "Email already registered" });

            // Hash password before saving
            user.Password = HashPassword(user.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "User registered successfully",
                user.Id,
                user.Name,
                user.Email,
                user.Role
            });
        }

   [HttpPost("login")]
public IActionResult Login([FromBody] User request)
{
    if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        return BadRequest(new { message = "Invalid login request" });

    var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

    if (user == null)
    {
        Console.WriteLine($"❌ Login failed: No user found with email {request.Email}");
        return Unauthorized(new { message = "Invalid credentials" });
    }

    // Hash the incoming password
    var inputHash = HashPassword(request.Password);

    // Debug logs
    Console.WriteLine("==== LOGIN DEBUG ====");
    Console.WriteLine($"📧 Email: {request.Email}");
    Console.WriteLine($"🔑 Entered Password (plain): {request.Password}");
    Console.WriteLine($"🔒 Entered Password (hashed): {inputHash}");
    Console.WriteLine($"🗄️ Stored Password (hashed): {user.Password}");
    Console.WriteLine("=====================");

    if (user.Password != inputHash)
    {
        return Unauthorized(new { message = "Invalid credentials" });
    }

    return Ok(new
    {
        message = "Login successful",
        user.Id,
        user.Name,
        user.Email,
        user.Role
    });
}


        // ✅ Utility: Hash password
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // ✅ Utility: Verify password
        private bool VerifyPassword(string inputPassword, string hashedPassword)
        {
            return HashPassword(inputPassword) == hashedPassword;
        }
    }
}
