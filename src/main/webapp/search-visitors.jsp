<%@page import="java.util.List"%>
<%@page import="com.ovms.Visitor"%>
<%@page import="com.ovms.VisitorDAO"%>
<%
    if (session.getAttribute("user") == null) { response.sendRedirect("login.jsp"); return; }
    String query = request.getParameter("searchQuery");
    VisitorDAO dao = new VisitorDAO();
    List<Visitor> results = (query != null && !query.trim().isEmpty()) ? dao.searchVisitors(query.trim()) : null;
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Search Visitors</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <%@include file="header.jsp"%>
    <div class="container-fluid">
        <div class="row">
            <%@include file="sidebar.jsp"%>
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                <h3 class="fw-bold mb-3">Search Visitors</h3>
                <div class="card p-4 shadow-sm bg-white mb-4">
                    <form method="GET" action="search-visitors.jsp">
                        <label class="form-label fw-semibold">Search by Visitor Name or Employee ID</label>
                        <div class="input-group">
                            <input type="text" name="searchQuery" class="form-control" placeholder="Enter keyword..." value="<%= query != null ? query : "" %>">
                            <button type="submit" class="btn btn-primary px-4">Search</button>
                        </div>
                    </form>
                </div>
                <% if (results != null) { %>
                <div class="card p-3 shadow-sm bg-white">
                    <h5>Search Results</h5>
                    <table class="table table-bordered table-striped align-middle mt-2">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Employee ID</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <%
                                int sIdx = 1;
                                for (Visitor v : results) {
                            %>
                            <tr>
                                <td><%= sIdx++ %></td>
                                <td><%= v.getName() %></td>
                                <td><%= v.getEmpId() %></td>
                                <td><%= v.getEmail() %></td>
                                <td><%= v.getDepartment() %></td>
                                <td><%= v.getPurpose() %></td>
                                <td><span class="badge <%= "IN".equals(v.getStatus()) ? "bg-success" : "bg-secondary" %>"><%= v.getStatus() %></span></td>
                            </tr>
                            <% } if (results.isEmpty()) { %>
                            <tr><td colspan="7" class="text-center text-muted">No records found.</td></tr>
                            <% } %>
                        </tbody>
                    </table>
                </div>
                <% } %>
            </main>
        </div>
    </div>
</body>
</html>