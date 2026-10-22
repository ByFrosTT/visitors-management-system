<%@page import="com.ovms.VisitorDAO"%>
<%
    if (session.getAttribute("user") == null) { response.sendRedirect("login.jsp"); return; }
    VisitorDAO dao = new VisitorDAO();
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <%@include file="header.jsp"%>
    <div class="container-fluid">
        <div class="row">
            <%@include file="sidebar.jsp"%>
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                <h3 class="fw-bold">Dashboard</h3>
                <p class="text-muted small">Home / Dashboard</p>
                <div class="row g-3 mt-2">
                    <div class="col-md-3">
                        <div class="card text-white bg-primary p-3 shadow-sm rounded-3">
                            <h2 class="fw-bold"><%= dao.getPreBookedCount() %></h2>
                            <h6>Pre-Booked Visitors</h6>
                            <a href="manage-visitors.jsp" class="text-white text-decoration-none small mt-2 d-inline-block">View all </a>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-success p-3 shadow-sm rounded-3">
                            <h2 class="fw-bold"><%= dao.getActiveInsideCount() %></h2>
                            <h6>Currently Inside</h6>
                            <a href="manage-visitors.jsp" class="text-white text-decoration-none small mt-2 d-inline-block">View active </a>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-info p-3 shadow-sm rounded-3">
                            <h2 class="fw-bold"><%= dao.getTodayCount() %></h2>
                            <h6>Today's Arrivals</h6>
                            <a href="manage-visitors.jsp" class="text-white text-decoration-none small mt-2 d-inline-block">More info </a>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-white bg-danger p-3 shadow-sm rounded-3">
                            <h2 class="fw-bold"><%= dao.getTotalCount() %></h2>
                            <h6>Total Records</h6>
                            <a href="manage-visitors.jsp" class="text-white text-decoration-none small mt-2 d-inline-block">More info </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>