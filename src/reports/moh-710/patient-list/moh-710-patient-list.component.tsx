import { useSession } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { getMoh710PatientList } from '../../../resources/moh-710.resource';

const Moh710PatientList: React.FC = () => {
  const [moh710PatientListData, setMoh710PatientListData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();
  const locationUuid = session?.sessionLocation?.uuid;
  return <></>;
};

export default Moh710PatientList;
