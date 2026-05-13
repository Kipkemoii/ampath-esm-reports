import React, { useEffect, useState } from 'react';
import { getNutritionRegister } from '../../../resources/moh-717.resource';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const NutritionRegisterComponent: React.FC = () => {
  const [patientlist, setPatientList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const locationUuids = searchParams.get('locationUuids');
  const indicator = searchParams.get('indicator');

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !locationUuids || !indicator) return;

      setIsLoading(true);

      try {
        const params = {
          startDate,
          endDate,
          locationUuids,
          indicator,
        };

        const data = await getNutritionRegister(params);
        setPatientList(data?.results.results || []);
      } catch (error) {
        console.error('Failed to fetch register data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, locationUuids, indicator]);

  function navigateBack() {
    navigate(location.state?.from || '/moh-705b');
  }
  return <></>;
};

export default NutritionRegisterComponent;
