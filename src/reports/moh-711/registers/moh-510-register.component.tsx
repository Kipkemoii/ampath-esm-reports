import { Button, Loading } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from '../moh711.scss';
import { getMoh510PatientList } from '../../../resources/moh-711.resource';

const Moh510Register: React.FC = () => {
  const navigate = useNavigate();

  const [patientlist, setPatientList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

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

        const data = await getMoh510PatientList(params);

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
    navigate('/moh-711');
  }
  return (
    <>
      <div className={styles.buttonContainer}>
        <Button onClick={navigateBack}>Back</Button>
      </div>
      <div>{isLoading && <Loading />}</div>
    </>
  );
};

export default Moh510Register;
