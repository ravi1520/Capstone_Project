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
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IHubContext<NotificationHub> _hub;

        public AppointmentController(AppDbContext context, EmailService emailService, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _emailService = emailService;
            _hub = hub;
        }

        // ✅ Book Appointment
        [HttpPost("book")]
        public IActionResult Book([FromBody] Appointment appointment)
        {
            if (appointment == null || appointment.UserId == 0 || appointment.DoctorId == 0)
                return BadRequest(new { message = "Invalid appointment request" });

            appointment.Status = "Booked";
            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            var user = _context.Users.FirstOrDefault(u => u.Id == appointment.UserId);
            if (user != null)
            {
                string msg = $"Your appointment with Doctor {appointment.DoctorId}  at {appointment.TimeSlot} is booked.";
                try
                {
                    _emailService.SendEmail(user.Email, "Appointment Booked", msg);
                    _hub.Clients.All.SendAsync("ReceiveNotification", user.Email, msg);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Notification error: {ex.Message}");
                }
            }

            return Ok(new { message = "Appointment booked successfully", appointment });
        }

        // ✅ Cancel Appointment
        [HttpPost("cancel/{id}")]
        public IActionResult Cancel(int id)
        {
            var appt = _context.Appointments.Find(id);
            if (appt == null) return NotFound(new { message = "Appointment not found" });

            appt.Status = "Cancelled";
            _context.SaveChanges();

            var user = _context.Users.FirstOrDefault(u => u.Id == appt.UserId);
            if (user != null)
            {
                string msg = $"Your appointment {appt.Id} has been cancelled.";
                try
                {
                    _emailService.SendEmail(user.Email, "Appointment Cancelled", msg);
                    _hub.Clients.All.SendAsync("ReceiveNotification", user.Email, msg);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Notification error: {ex.Message}");
                }
            }

            return Ok(new { message = "Appointment cancelled" });
        }

        // ✅ Confirm Appointment
        [HttpPost("confirm/{id}")]
        public IActionResult Confirm(int id)
        {
            var appt = _context.Appointments.Find(id);
            if (appt == null) return NotFound(new { message = "Appointment not found" });

            appt.Status = "Confirmed";
            _context.SaveChanges();

            var user = _context.Users.FirstOrDefault(u => u.Id == appt.UserId);
            if (user != null)
            {
                string msg = $"Your appointment {appt.Id} has been confirmed.";
                try
                {
                    _emailService.SendEmail(user.Email, "Appointment Confirmed", msg);
                    _hub.Clients.All.SendAsync("ReceiveNotification", user.Email, msg);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Notification error: {ex.Message}");
                }
            }

            return Ok(new { message = "Appointment confirmed" });
        }

        // ✅ List Appointments with optional filters
        [HttpGet("list")]
        public IActionResult List(string? city = null, DateTime? date = null)
        {
            var query = _context.Appointments.AsQueryable();

            if (date.HasValue)
                query = query.Where(a => a.Date.Date == date.Value.Date);

            if (!string.IsNullOrEmpty(city))
            {
                var doctorIds = _context.Doctors
                                        .Where(d => d.City == city)
                                        .Select(d => d.Id)
                                        .ToList();
                query = query.Where(a => doctorIds.Contains(a.DoctorId));
            }

            return Ok(query.ToList());
        }
    }
}
