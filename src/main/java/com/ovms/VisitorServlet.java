package com.ovms;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet(name = "VisitorServlet", urlPatterns = {"/VisitorServlet"})
public class VisitorServlet extends HttpServlet {
    private VisitorDAO dao = new VisitorDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        HttpSession session = request.getSession();

        if ("login".equalsIgnoreCase(action)) {
            String u = request.getParameter("username");
            String p = request.getParameter("password");
            String adminUser = System.getenv("VISITOR_ADMIN_USER");
            String adminPassword = System.getenv("VISITOR_ADMIN_PASSWORD");
            if (adminUser != null && !adminUser.isBlank()
                    && adminPassword != null && !adminPassword.isBlank()
                    && adminUser.equals(u) && adminPassword.equals(p)) {
                session.setAttribute("user", u);
                response.sendRedirect("dashboard.jsp");
            } else {
                response.sendRedirect("login.jsp?error=Invalid Credentials");
            }
        } else if ("add_walkin".equalsIgnoreCase(action)) {
            String name = request.getParameter("name");
            String empId = request.getParameter("empId");
            String email = request.getParameter("email");
            String department = request.getParameter("department");
            String purpose = request.getParameter("purpose");

            dao.addWalkInVisitor(new Visitor(name, empId, email, department, purpose, null));
            response.sendRedirect("manage-visitors.jsp");
        } else if ("pre_register".equalsIgnoreCase(action)) {
            String name = request.getParameter("name");
            String empId = request.getParameter("empId");
            String email = request.getParameter("email");
            String department = request.getParameter("department");
            String purpose = request.getParameter("purpose");
            String expectedDate = request.getParameter("expectedDate");

            dao.addPreRegisteredVisitor(new Visitor(name, empId, email, department, purpose, expectedDate));
            response.sendRedirect("manage-visitors.jsp");
        } else if ("checkin_prebooked".equalsIgnoreCase(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            dao.checkInPreBooked(id);
            response.sendRedirect("manage-visitors.jsp");
        } else if ("checkout".equalsIgnoreCase(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            dao.checkOutVisitor(id);
            response.sendRedirect("manage-visitors.jsp");
        } else if ("delete".equalsIgnoreCase(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            dao.deleteVisitor(id);
            response.sendRedirect("manage-visitors.jsp");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("logout".equalsIgnoreCase(action)) {
            request.getSession().invalidate();
            response.sendRedirect("login.jsp");
        }
    }
}