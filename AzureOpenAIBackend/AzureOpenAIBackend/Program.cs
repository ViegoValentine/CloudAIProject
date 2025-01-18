var builder = WebApplication.CreateBuilder(args);

// Dodaj obs³ugê HTTP Client
builder.Services.AddHttpClient();

// Dodaj obs³ugê kontrolerów
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
