// Inisialisasi Data dari Local Storage
let students = JSON.parse(localStorage.getItem('students')) || [];

// Mengambil elemen DOM
const studentForm = document.getElementById('studentForm');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const editIndexInput = document.getElementById('editIndex');

// Fungsi Menghitung Statistik Dashboard
function updateDashboard() {
    document.getElementById('totalSiswa').textContent = students.length;
    document.getElementById('totalX').textContent = students.filter(s => s.kelas === 'X PPLG').length;
    document.getElementById('totalXI').textContent = students.filter(s => s.kelas === 'XI PPLG').length;
    document.getElementById('totalXII').textContent = students.filter(s => s.kelas === 'XII PPLG').length;
}

// Fungsi Render Tabel
function renderTable(data = students) {
    tableBody.innerHTML = '';
    data.forEach((student, index) => {
        // Melacak index asli dari array students meski sedang di-filter
        const realIndex = students.indexOf(student); 
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${student.nisn}</strong></td>
            <td>${student.nama}</td>
            <td><span style="background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${student.kelas}</span></td>
            <td>${student.alamat}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="editStudent(${realIndex})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteStudent(${realIndex})" title="Hapus"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateDashboard(); // Perbarui statistik setiap kali tabel di-render
}

// Fungsi Tambah & Update Data (Submit)
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nisnVal = document.getElementById('nisn').value;
    const namaVal = document.getElementById('nama').value;
    const kelasVal = document.getElementById('kelas').value;
    const alamatVal = document.getElementById('alamat').value;
    const index = parseInt(editIndexInput.value);

    const studentData = { nisn: nisnVal, nama: namaVal, kelas: kelasVal, alamat: alamatVal };

    if(index === -1) {
        // Mode Tambah Data Baru
        students.push(studentData);
    } else {
        // Mode Update Data
        students[index] = studentData;
        alert('Data berhasil diperbarui!');
    }

    localStorage.setItem('students', JSON.stringify(students));
    resetForm();
    renderTable();
});

// Fungsi Edit (Memasukkan data ke form)
function editStudent(index) {
    const student = students[index];
    document.getElementById('nisn').value = student.nisn;
    document.getElementById('nama').value = student.nama;
    document.getElementById('kelas').value = student.kelas;
    document.getElementById('alamat').value = student.alamat;
    
    document.getElementById('editIndex').value = index;
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Data Siswa';
    document.getElementById('btnSubmit').innerHTML = '<i class="fas fa-save"></i> Perbarui Data';
    document.getElementById('btnCancel').style.display = 'block';
}

// Fungsi Reset Form
function resetForm() {
    studentForm.reset();
    document.getElementById('editIndex').value = '-1';
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-user-plus"></i> Tambah Data Siswa';
    document.getElementById('btnSubmit').innerHTML = '<i class="fas fa-save"></i> Simpan Data';
    document.getElementById('btnCancel').style.display = 'none';
}

// Fungsi Hapus Data
function deleteStudent(index) {
    if(confirm(`Yakin ingin menghapus data atas nama ${students[index].nama}?`)) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderTable();
    }
}

// Fitur Export ke CSV (Excel)
function exportToCSV() {
    if(students.length === 0) {
        alert("Tidak ada data untuk diexport!");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,NISN,Nama Lengkap,Kelas,Alamat\n";
    students.forEach(s => {
        let row = `"${s.nisn}","${s.nama}","${s.kelas}","${s.alamat}"`;
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Data_Siswa_PPLG.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fitur Pencarian Real-time
searchInput.addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = students.filter(s => 
        s.nama.toLowerCase().includes(keyword) || s.nisn.includes(keyword)
    );
    renderTable(filtered);
});

// Render awal
renderTable();