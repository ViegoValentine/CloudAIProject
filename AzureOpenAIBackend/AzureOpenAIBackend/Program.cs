var builder = WebApplication.CreateBuilder(args);

// Dodaj obs�ug� HTTP Client
builder.Services.AddHttpClient();

// Dodaj obs�ug� kontroler�w
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
