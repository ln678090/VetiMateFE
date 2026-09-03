import { useState, useEffect } from 'react';

export interface Province {
  id: string;
  code: number;
  name: string;
}

export interface Commune {
  id: string;
  code: number;
  name: string;
}

export function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://provinces.open-api.vn/api/v2/');
        const data = await res.json();
        const mapped = data.map((p: { code: number; name: string }) => ({
          ...p,
          id: p.code.toString(),
          // Cắt bỏ chữ "Tỉnh", "Thành phố" cho gọn
          name: p.name.replace(/^(Tỉnh |Thành phố )/, ''),
        }));
        setProvinces(mapped);
      } catch (error) {
        console.error('Failed to fetch provinces', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, loading };
}

export function useDistricts(provinceId: string) {
  const [districts, setDistricts] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provinceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceId}?depth=2`);
        const data = await res.json();
        if (data && data.wards) {
          const mapped = data.wards.map((w: { code: number; name: string }) => ({
            ...w,
            id: w.code.toString(),
            name: w.name,
          }));
          setDistricts(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch districts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [provinceId]);

  return { districts, loading };
}
