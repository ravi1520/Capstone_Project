using Microsoft.AspNetCore.Mvc;
using FractoBackend.Data;
using FractoBackend.Models;
using FractoBackend.Services;
using FractoBackend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FractoBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IHubContext<NotificationHub> _hub;

        public DoctorController(AppDbContext context, EmailService emailService, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _emailService = emailService;
            _hub = hub;
        }
[HttpPost("add")]
public IActionResult AddDoctor([FromBody] Doctor doctor)
{
    try
    {
        if (doctor == null)
            return BadRequest(new { message = "Doctor object is required" });

        // Save doctor to DB
        _context.Doctors.Add(doctor);
        _context.SaveChanges();

        // ✅ Notify users safely
        var users = _context.Users.Where(u => u.Role == "User").ToList();

        foreach (var user in users)
        {
            try
            {
                string msg = $"New {doctor.Specialization} doctor ({doctor.Name}) added in {doctor.City}.";

                // Email notification
                _emailService.SendEmail(user.Email, "New Doctor Available", msg);

                // SignalR notification
                _hub.Clients.All.SendAsync("ReceiveNotification", user.Email, msg);
            }
            catch (Exception notifyEx)
            {
                Console.WriteLine($"⚠️ Notification failed for {user.Email}: {notifyEx.Message}");
                // Don’t break the loop, continue notifying others
            }
        }

        return Ok(new { message = "Doctor added successfully", doctor });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ AddDoctor failed: {ex.Message}");
        return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
    }
}


        [HttpGet("all")]
        public IActionResult GetAllDoctors() => Ok(_context.Doctors.ToList());

        [HttpGet("list")]
        public IActionResult GetDoctors(string city, string specialization, DateTime date, double? minRating = null)
        {
            var doctors = _context.Doctors
                .Where(d => d.City == city && d.Specialization == specialization)
                .OrderByDescending(d => d.Rating)
                .ToList();

            if (minRating.HasValue)
                doctors = doctors.Where(d => d.Rating >= minRating.Value).ToList();

            return Ok(doctors);
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateDoctor(int id, Doctor doctor)
        {
            var existing = _context.Doctors.Find(id);
            if (existing == null) return NotFound();

            existing.Name = doctor.Name;
            existing.Specialization = doctor.Specialization;
            existing.City = doctor.City;
            existing.Rating = doctor.Rating;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteDoctor(int id)
        {
            var doc = _context.Doctors.Find(id);
            if (doc == null) return NotFound();
            _context.Doctors.Remove(doc);
            _context.SaveChanges();
            return Ok(new { message = "Doctor deleted successfully" });
        }

        [HttpGet("timeslots/{doctorId}")]
        public IActionResult GetTimeSlots(int doctorId)
        {
            var doctor = _context.Doctors.Find(doctorId);
            if (doctor == null) return NotFound();
            return Ok(doctor.TimeSlots);
        }
    }
}
