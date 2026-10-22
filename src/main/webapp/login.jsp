<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .login-card { width: 420px; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .brand-title { color: #a33b58; font-weight: 600; text-align: center; }
        .btn-green { background-color: #198754; color: #fff; font-weight: 500; }
        .btn-green:hover { background-color: #157347; color: #fff; }
    </style>
</head>
<body>
    <div class="card p-4 login-card bg-white">
        <h4 class="brand-title mb-1">Visitor Management System</h4>
        <h5 class="text-center text-muted mb-4">(VMS)</h5>
        <% if (request.getParameter("error") != null) { %>
            <div class="alert alert-danger py-2 text-center small"><%= request.getParameter("error") %></div>
        <% } %>
        <form action="VisitorServlet" method="POST">
            <input type="hidden" name="action" value="login">
            <div class="mb-3">
                <label class="form-label text-muted small fw-bold">Username</label>
                <input type="text" name="username" class="form-control" placeholder="Enter Username" required>
            </div>
            <div class="mb-4">
                <label class="form-label text-muted small fw-bold">Password</label>
                <input type="password" name="password" class="form-control" placeholder="Enter Password" required>
            </div>
            <button type="submit" class="btn btn-green w-100 py-2">Login</button>
        </form>
    </div>
</body>
</html>