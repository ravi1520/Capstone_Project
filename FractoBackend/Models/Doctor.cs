using System.ComponentModel.DataAnnotations;

namespace FractoBackend.Models
{
    public class Doctor
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public string Name { get; set; } = string.Empty;

        [Required] 
        public string Specialization { get; set; } = string.Empty;

        [Required] 
        public string City { get; set; } = string.Empty;

        public double Rating { get; set; } = 0;

        // Default available slots
        public string[] TimeSlots { get; set; } = { "10:00AM", "11:00AM", "02:00PM", "04:00PM" };
    }
}
