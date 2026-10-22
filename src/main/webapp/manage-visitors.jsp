<%@page import="java.util.List"%>
<%@page import="com.ovms.Visitor"%>
<%@page import="com.ovms.VisitorDAO"%>
<%
    if (session.getAttribute("user") == null) { response.sendRedirect("login.jsp"); return; }
    VisitorDAO dao = new VisitorDAO();
    List<Visitor> list = dao.getAllVisitors();
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS - Manage Visitors</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <%@include file="header.jsp"%>
    <div class="container-fluid">
        <div class="row">
            <%@include file="sidebar.jsp"%>
            <main class="col-md-10 ms-sm-auto px-md-4 py-4">
                <h3 class="fw-bold mb-3">Manage Visitors</h3>
                <div class="card p-3 shadow-sm bg-white">
                    <table class="table table-bordered table-striped align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Purpose</th>
                                <th>Date / Timing</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <%
                                int idx = 1;
                                for (Visitor v : list) {
                            %>
                            <tr>
                                <td><%= idx++ %></td>
                                <td><%= v.getName() %><br><small class="text-muted"><%= v.getEmail() %></small></td>
                                <td><%= v.getEmpId() %></td>
                                <td><%= v.getDepartment() %></td>
                                <td><%= v.getPurpose() %></td>
                                <td>
                                    <% if ("PRE_BOOKED".equals(v.getStatus())) { %>
                                        <span class="text-primary small fw-bold">Expected: <%= v.getExpectedDate() %></span>
                                    <% } else { %>
                                        <small>In: <%= v.getCheckinTime() %></small><br>
                                        <small class="text-muted">Out: <%= v.getCheckoutTime() != null ? v.getCheckoutTime() : "--" %></small>
                                    <% } %>
                                </td>
                                <td>
                                    <% if ("PRE_BOOKED".equals(v.getStatus())) { %>
                                        <span class="badge bg-info text-dark">Pre-Booked</span>
                                    <% } else if ("IN".equals(v.getStatus())) { %>
                                        <span class="badge bg-success">Active IN</span>
                                    <% } else { %>
                                        <span class="badge bg-secondary">Checked OUT</span>
                                    <% } %>
                                </td>
                                <td>
                                    <div class="d-flex gap-1">
                                        <% if ("PRE_BOOKED".equals(v.getStatus())) { %>
                                        <form action="VisitorServlet" method="POST" class="d-inline m-0">
                                            <input type="hidden" name="action" value="checkin_prebooked">
                                            <input type="hidden" name="id" value="<%= v.getId() %>">
                                            <button type="submit" class="btn btn-success btn-sm">Check-In</button>
                                        </form>
                                        <% } else if ("IN".equals(v.getStatus())) { %>
                                        <button onclick="printPass('<%= v.getName() %>', '<%= v.getEmpId() %>', '<%= v.getEmail() %>', '<%= v.getDepartment() %>', '<%= v.getPurpose() %>', '<%= v.getCheckinTime() %>')" 
                                                class="btn btn-outline-secondary btn-sm">Pass</button>
                                        <form action="VisitorServlet" method="POST" class="d-inline m-0">
                                            <input type="hidden" name="action" value="checkout">
                                            <input type="hidden" name="id" value="<%= v.getId() %>">
                                            <button type="submit" class="btn btn-warning btn-sm">Out</button>
                                        </form>
                                        <% } %>

                                        <form action="VisitorServlet" method="POST" class="d-inline m-0">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<%= v.getId() %>">
                                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this visitor?');">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            <% } %>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>

    <!-- Pass Generator Modal Print -->
    <script>
        function printPass(name, empId, email, dept, purpose, time) {
            let passWindow = window.open('', '', 'width=650,height=450');
            passWindow.document.write(`
                <html>
                <head>
                    <title>Visitor Gate Pass</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="p-4">
                    <div class="card p-4 border-2 border-dark shadow-sm">
                        <div class="text-center border-bottom pb-2 mb-3">
                            <h4 class="fw-bold mb-0" style="color: #6a1b9a;">COMPANY VISITOR MANAGEMENT SYSTEM</h4>
                            <small class="text-muted">VISITOR ENTRY PASS</small>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6"><strong>Visitor Name:</strong> ` + name + `</div>
                            <div class="col-6"><strong>Employee ID:</strong> ` + empId + `</div>
                            <div class="col-6"><strong>Email:</strong> ` + email + `</div>
                            <div class="col-6"><strong>Department:</strong> ` + dept + `</div>
                            <div class="col-12"><strong>Purpose of Visit:</strong> ` + purpose + `</div>
                            <div class="col-12"><strong>Check-In Time:</strong> ` + time + `</div>
                        </div>
                        <div class="d-flex justify-content-between pt-4 mt-3 border-top text-muted small">
                            <span>Security Signature: ___________________</span>
                            <span>Authorized Signatory</span>
                        </div>
                    </div>
                </body>
                </html>
            `);
            passWindow.document.close();
            passWindow.focus();
            setTimeout(() => { passWindow.print(); }, 250);
        }
    </script>
</body>
</html>