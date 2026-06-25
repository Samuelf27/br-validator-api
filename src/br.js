// Validação e geração de documentos brasileiros (sem dependências).
const onlyDigits = (s) => String(s ?? '').replace(/\D/g, '');
const allSame = (s) => /^(\d)\1+$/.test(s);
const rng = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');

// CPF
const cpfDV = (b, f) => { let t = 0; for (const d of b) t += +d * f--; const r = (t * 10) % 11; return r === 10 ? 0 : r; };
export const isValidCPF = (v) => { const d = onlyDigits(v); return d.length === 11 && !allSame(d) && cpfDV(d.slice(0, 9), 10) === +d[9] && cpfDV(d.slice(0, 10), 11) === +d[10]; };
export const generateCPF = () => { const b = rng(9); const d1 = cpfDV(b, 10); const d2 = cpfDV(b + d1, 11); return `${b}${d1}${d2}`.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); };

// CNPJ
const F = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], S = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const cnpjDV = (b, w) => { let t = 0; for (let i = 0; i < w.length; i++) t += +b[i] * w[i]; const r = t % 11; return r < 2 ? 0 : 11 - r; };
export const isValidCNPJ = (v) => { const d = onlyDigits(v); return d.length === 14 && !allSame(d) && cnpjDV(d.slice(0, 12), F) === +d[12] && cnpjDV(d.slice(0, 13), S) === +d[13]; };
export const generateCNPJ = () => { const b = rng(8) + '0001'; const d1 = cnpjDV(b, F); const d2 = cnpjDV(b + d1, S); return `${b}${d1}${d2}`.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'); };

// PIS
const PW = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const pisDV = (b) => { let t = 0; for (let i = 0; i < 10; i++) t += +b[i] * PW[i]; const r = 11 - (t % 11); return r >= 10 ? 0 : r; };
export const isValidPIS = (v) => { const d = onlyDigits(v); return d.length === 11 && !allSame(d) && pisDV(d.slice(0, 10)) === +d[10]; };
export const generatePIS = () => { const b = rng(10); return `${b}${pisDV(b)}`.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4'); };

// CEP
export const isValidCEP = (v) => onlyDigits(v).length === 8;

// Telefone
const DDD = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99]);
export const isValidPhone = (v) => { const d = onlyDigits(v); if (d.length !== 10 && d.length !== 11) return false; if (!DDD.has(+d.slice(0, 2))) return false; if (d.length === 11 && d[2] !== '9') return false; if (d.length === 10 && !'2345'.includes(d[2])) return false; return true; };

export const VALIDATORS = { cpf: isValidCPF, cnpj: isValidCNPJ, pis: isValidPIS, cep: isValidCEP, phone: isValidPhone };
export const GENERATORS = { cpf: generateCPF, cnpj: generateCNPJ, pis: generatePIS };
