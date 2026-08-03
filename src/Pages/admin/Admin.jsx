import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/header";

function Admin() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [acting, setActing] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      navigate("/account");
      return;
    }
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch users");
        return r.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDelete = async (targetUser) => {
    setOpenMenu(null);
    if (
      !confirm(
        `Are you sure you want to delete ${targetUser.name}? This cannot be undone.`,
      )
    )
      return;
    setActing(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
    } catch {
      alert("Something went wrong.");
    } finally {
      setActing(null);
    }
  };

  const handlePromote = async (targetUser) => {
    setOpenMenu(null);
    if (!confirm(`Promote ${targetUser.name} to admin?`)) return;
    setActing(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to promote user");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: "admin" } : u)),
      );
    } catch {
      alert("Something went wrong.");
    } finally {
      setActing(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  const isAdmin = (u) => u.role === "admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#18052D",
        color: "#e9d5ff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Header hideNav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <p style={{ color: "#a78bfa", fontSize: "0.85rem", margin: 0 }}>
              ⚙ Admin Panel
            </p>
            <h1
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.8rem",
                fontWeight: 700,
              }}
            >
              Software Study Scripts
            </h1>
          </div>
          <Link href="/account">
            <button
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(167,139,250,0.3)",
                background: "transparent",
                color: "#a78bfa",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ← Back to Account
            </button>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {[
            { label: "Total Users", value: users.length },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "admin").length,
            },
            {
              label: "Regular Users",
              value: users.filter((u) => u.role === "user").length,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.2)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: "2rem", fontWeight: 700, color: "#a78bfa" }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(233,213,255,0.6)",
                  marginTop: "0.25rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid rgba(167,139,250,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
              Registered Users
            </h2>
            <span
              style={{ fontSize: "0.8rem", color: "rgba(233,213,255,0.5)" }}
            >
              {users.length} total
            </span>
          </div>

          {loading && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "rgba(233,213,255,0.5)",
              }}
            >
              Loading users...
            </div>
          )}
          {error && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#f87171" }}
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(167,139,250,0.1)" }}>
                  {["Name", "Email", "Role", "Joined", "Last Login", ""].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1.5rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          color: "rgba(233,213,255,0.5)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom:
                        i < users.length - 1
                          ? "1px solid rgba(167,139,250,0.08)"
                          : "none",
                    }}
                  >
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(167,139,250,0.15)",
                            border: "1px solid rgba(167,139,250,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#a78bfa",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "rgba(233,213,255,0.7)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {u.email}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background:
                            u.role === "admin"
                              ? "rgba(167,139,250,0.15)"
                              : "rgba(255,255,255,0.05)",
                          border: `1px solid ${u.role === "admin" ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`,
                          color:
                            u.role === "admin"
                              ? "#a78bfa"
                              : "rgba(233,213,255,0.5)",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "rgba(233,213,255,0.5)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {new Date(u.createdAt).toLocaleDateString("en-CA")}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "rgba(233,213,255,0.5)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString("en-CA")
                        : "Never"}
                    </td>

                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "right",
                        position: "relative",
                      }}
                    >
                      {!isAdmin(u) && (
                        <div
                          ref={openMenu === u.id ? menuRef : null}
                          style={{
                            display: "inline-block",
                            position: "relative",
                          }}
                        >
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu === u.id ? null : u.id)
                            }
                            disabled={acting === u.id}
                            style={{
                              padding: "0.3rem 0.6rem",
                              borderRadius: "0.4rem",
                              border: "1px solid rgba(167,139,250,0.2)",
                              background: "transparent",
                              color: "rgba(233,213,255,0.6)",
                              cursor: "pointer",
                              fontSize: "1rem",
                              opacity: acting === u.id ? 0.5 : 1,
                            }}
                          >
                            {acting === u.id ? "..." : "⋯"}
                          </button>

                          {openMenu === u.id && (
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                top: "calc(100% + 4px)",
                                background: "#1e0a3c",
                                border: "1px solid rgba(167,139,250,0.25)",
                                borderRadius: "0.5rem",
                                padding: "0.35rem",
                                zIndex: 100,
                                minWidth: "160px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                              }}
                            >
                              <button
                                onClick={() => handlePromote(u)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "0.35rem",
                                  border: "none",
                                  background: "transparent",
                                  color: "#a78bfa",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    "rgba(167,139,250,0.1)")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = "transparent")
                                }
                              >
                                ↑ Promote to Admin
                              </button>
                              <div
                                style={{
                                  height: "1px",
                                  background: "rgba(167,139,250,0.1)",
                                  margin: "0.25rem 0",
                                }}
                              />
                              <button
                                onClick={() => handleDelete(u)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "0.35rem",
                                  border: "none",
                                  background: "transparent",
                                  color: "#f87171",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.background =
                                    "rgba(248,113,113,0.08)")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.background = "transparent")
                                }
                              >
                                🗑 Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
