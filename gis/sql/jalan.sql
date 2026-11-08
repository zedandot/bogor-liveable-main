-- Jaringan jalan RBI BIG 1:25.000 (tanpa jalan setapak).
SELECT NAMRJL AS nama, REMARK AS kelas, geometry
FROM JALAN_LN_25K
WHERE REMARK <> 'Jalan Setapak'

