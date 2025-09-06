using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace FractoBackend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Fracto Appointment", _config["EmailSettings:SenderEmail"]));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;
            email.Body = new TextPart("plain") { Text = body };

            using var smtp = new SmtpClient();
            smtp.Connect(
                _config["EmailSettings:SmtpServer"], 
                int.Parse(_config["EmailSettings:Port"]), 
                SecureSocketOptions.StartTls // ✅ important for Gmail
            );
            smtp.Authenticate(_config["EmailSettings:SenderEmail"], _config["EmailSettings:Password"]);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
