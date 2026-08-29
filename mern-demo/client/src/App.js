import React, { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [maSV, setMaSV] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Lỗi kết nối Backend:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!maSV || !hoTen || !email) return;

    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ maSV, hoTen, email })
      });

      if (res.ok) {
        setMaSV('');
        setHoTen('');
        setEmail('');
        fetchStudents();
      } else {
        alert("Lỗi từ server khi thêm sinh viên!");
      }
    } catch (err) {
      console.error("Lỗi khi kết nối server:", err);
      alert("Không thể kết nối tới Backend!");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Thêm Sinh Viên Mới</h2>
      <form onSubmit={handleAdd} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Mã Sinh Viên:</label>
          <input type="text" value={maSV} onChange={(e) => setMaSV(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Họ và Tên:</label>
          <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" style={{ backgroundColor: '#00c853', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm Sinh Viên</button>
      </form>

      <h2 style={{ textAlign: 'center' }}>Danh Sách Sinh Viên</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} border="1" cellPadding="10">
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ textAlign: 'center' }}>STT</th>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((st, idx) => (
              <tr key={st._id || idx}>
                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                <td>{st.maSV || st.id || st.studentId}</td>
                <td>{st.hoTen || st.name || st.fullName}</td>
                <td>{st.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có dữ liệu sinh viên</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
