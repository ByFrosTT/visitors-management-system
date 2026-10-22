<%
    if (session.getAttribute("user") == null) { response.sendRedirect("login.jsp"); return; }
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Add Walk-In Visitor</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <%@include file="header.jsp"%>
    <div class="container-fluid">
        <div class="row">
            <%@include file="sidebar.jsp"%>
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                <h3 class="fw-bold mb-3">Add Walk-In Visitor</h3>
                <div class="card p-4 shadow-sm bg-white col-md-8">
                    <form action="VisitorServlet" method="POST">
                        <input type="hidden" name="action" value="add_walkin">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Full Name</label>
                            <input type="text" name="name" class="form-control" placeholder="Enter Full Name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Employee ID</label>
                            <input type="text" name="empId" class="form-control" placeholder="Enter Employee ID" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Email</label>
                            <input type="email" name="email" class="form-control" placeholder="Enter Email" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Department</label>
                            <input type="text" name="department" class="form-control" placeholder="Enter Department" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Purpose of Visit</label>
                            <textarea name="purpose" class="form-control" rows="2" placeholder="Enter Purpose of Visit" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary px-4">Check In Now</button>
                    </form>
                </div>
            </main>
        </div>
    </div>
</body>
</html>