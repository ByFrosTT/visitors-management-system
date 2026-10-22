<%
    if (session.getAttribute("user") == null) { response.sendRedirect("login.jsp"); return; }
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Visitor Pre-Registration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <%@include file="header.jsp"%>
    <div class="container-fluid">
        <div class="row">
            <%@include file="sidebar.jsp"%>
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                <h3 class="fw-bold mb-1">Pre-Register a Visitor</h3>
                <p class="text-muted small mb-3">Schedule a planned visitor arrival prior to their gate entry.</p>
                
                <div class="card p-4 shadow-sm bg-white col-md-8">
                    <form action="VisitorServlet" method="POST">
                        <input type="hidden" name="action" value="pre_register">
                        
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Visitor Full Name</label>
                            <input type="text" name="name" class="form-control" placeholder="Enter Full Name" required>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Host Employee ID</label>
                                <input type="text" name="empId" class="form-control" placeholder="e.g. EMP102" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Visitor Email</label>
                                <input type="email" name="email" class="form-control" placeholder="visitor@example.com" required>
                            </div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Department</label>
                                <input type="text" name="department" class="form-control" placeholder="e.g. IT, HR, Sales" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Expected Visit Date</label>
                                <input type="date" name="expectedDate" class="form-control" required>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-semibold">Purpose of Visit</label>
                            <textarea name="purpose" class="form-control" rows="2" placeholder="e.g. Vendor meeting, Project discussion" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-success px-4">Pre-Register Visitor</button>
                    </form>
                </div>
            </main>
        </div>
    </div>
</body>
</html>