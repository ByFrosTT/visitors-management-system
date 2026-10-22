package com.ovms;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class VisitorDAO {

    static {
        try {
            Class.forName("org.h2.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // Connects to a persistent file database in your user folder (~/cvms_db)
    private Connection getConnection() throws Exception {
        return DriverManager.getConnection("jdbc:h2:~/cvms_db;DB_CLOSE_DELAY=-1", "sa", "");
    }

    public VisitorDAO() {
        // Automatically creates the table on startup
        String sql = "CREATE TABLE IF NOT EXISTS VISITORS ("
                   + "ID INT PRIMARY KEY AUTO_INCREMENT, "
                   + "NAME VARCHAR(100) NOT NULL, "
                   + "EMP_ID VARCHAR(50) NOT NULL, "
                   + "EMAIL VARCHAR(100) NOT NULL, "
                   + "DEPARTMENT VARCHAR(100) NOT NULL, "
                   + "PURPOSE VARCHAR(255) NOT NULL, "
                   + "EXPECTED_DATE VARCHAR(20), "
                   + "CHECKIN_TIME TIMESTAMP, "
                   + "CHECKOUT_TIME TIMESTAMP, "
                   + "STATUS VARCHAR(20) DEFAULT 'IN')";
        try (Connection con = getConnection(); Statement st = con.createStatement()) {
            st.execute(sql);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean addWalkInVisitor(Visitor v) {
        String sql = "INSERT INTO VISITORS (NAME, EMP_ID, EMAIL, DEPARTMENT, PURPOSE, CHECKIN_TIME, STATUS) "
                   + "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'IN')";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, v.getName());
            ps.setString(2, v.getEmpId());
            ps.setString(3, v.getEmail());
            ps.setString(4, v.getDepartment());
            ps.setString(5, v.getPurpose());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean addPreRegisteredVisitor(Visitor v) {
        String sql = "INSERT INTO VISITORS (NAME, EMP_ID, EMAIL, DEPARTMENT, PURPOSE, EXPECTED_DATE, STATUS) "
                   + "VALUES (?, ?, ?, ?, ?, ?, 'PRE_BOOKED')";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, v.getName());
            ps.setString(2, v.getEmpId());
            ps.setString(3, v.getEmail());
            ps.setString(4, v.getDepartment());
            ps.setString(5, v.getPurpose());
            ps.setString(6, v.getExpectedDate());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean checkInPreBooked(int id) {
        String sql = "UPDATE VISITORS SET CHECKIN_TIME = CURRENT_TIMESTAMP, STATUS = 'IN' WHERE ID = ?";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean checkOutVisitor(int id) {
        String sql = "UPDATE VISITORS SET CHECKOUT_TIME = CURRENT_TIMESTAMP, STATUS = 'OUT' WHERE ID = ?";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteVisitor(int id) {
        String sql = "DELETE FROM VISITORS WHERE ID = ?";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Visitor> getAllVisitors() {
        List<Visitor> list = new ArrayList<>();
        String sql = "SELECT * FROM VISITORS ORDER BY ID DESC";
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Visitor v = new Visitor();
                v.setId(rs.getInt("ID"));
                v.setName(rs.getString("NAME"));
                v.setEmpId(rs.getString("EMP_ID"));
                v.setEmail(rs.getString("EMAIL"));
                v.setDepartment(rs.getString("DEPARTMENT"));
                v.setPurpose(rs.getString("PURPOSE"));
                v.setExpectedDate(rs.getString("EXPECTED_DATE"));
                v.setCheckinTime(rs.getTimestamp("CHECKIN_TIME"));
                v.setCheckoutTime(rs.getTimestamp("CHECKOUT_TIME"));
                v.setStatus(rs.getString("STATUS"));
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Visitor> searchVisitors(String keyword) {
        List<Visitor> list = new ArrayList<>();
        String sql = "SELECT * FROM VISITORS WHERE LOWER(NAME) LIKE ? OR LOWER(EMP_ID) LIKE ? ORDER BY ID DESC";
        try (Connection con = getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
            String pattern = "%" + keyword.toLowerCase() + "%";
            ps.setString(1, pattern);
            ps.setString(2, pattern);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Visitor v = new Visitor();
                    v.setId(rs.getInt("ID"));
                    v.setName(rs.getString("NAME"));
                    v.setEmpId(rs.getString("EMP_ID"));
                    v.setEmail(rs.getString("EMAIL"));
                    v.setDepartment(rs.getString("DEPARTMENT"));
                    v.setPurpose(rs.getString("PURPOSE"));
                    v.setExpectedDate(rs.getString("EXPECTED_DATE"));
                    v.setCheckinTime(rs.getTimestamp("CHECKIN_TIME"));
                    v.setCheckoutTime(rs.getTimestamp("CHECKOUT_TIME"));
                    v.setStatus(rs.getString("STATUS"));
                    list.add(v);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public int getTodayCount() {
        return getCount("SELECT COUNT(*) FROM VISITORS WHERE CAST(CHECKIN_TIME AS DATE) = CURRENT_DATE");
    }

    public int getPreBookedCount() {
        return getCount("SELECT COUNT(*) FROM VISITORS WHERE STATUS = 'PRE_BOOKED'");
    }

    public int getActiveInsideCount() {
        return getCount("SELECT COUNT(*) FROM VISITORS WHERE STATUS = 'IN'");
    }

    public int getTotalCount() {
        return getCount("SELECT COUNT(*) FROM VISITORS");
    }

    private int getCount(String sql) {
        try (Connection con = getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
}