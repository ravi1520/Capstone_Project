using FractoBackend.Data;
using FractoBackend.Services;
using FractoBackend.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services
builder.Services.AddScoped<EmailService>();
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Add CORS (Angular Dev + Production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200", "https://yourdomain.com")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // ✅ Force HTTPS in Production
    app.UseHttpsRedirection();
}

app.UseRouting();

// ✅ Enable CORS before Auth
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

// ✅ If serving Angular from ASP.NET Core
// app.MapFallbackToFile("index.html");

app.Run();
