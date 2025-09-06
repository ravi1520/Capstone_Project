using System.ComponentModel.DataAnnotations;

namespace FractoBackend.Models
{
    public class Appointment
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public int UserId { get; set; }

        [Required] 
        public int DoctorId { get; set; }

        [Required] 
        public DateTime Date { get; set; }

        [Required] 
        public string TimeSlot { get; set; } = string.Empty;

        [Required] 
        public string Status { get; set; } = "Booked"; // Booked / Confirmed / Cancelled
    }
}
