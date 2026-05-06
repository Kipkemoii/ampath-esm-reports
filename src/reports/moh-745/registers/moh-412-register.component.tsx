import { Button, Loading, Table, TableBody, TableHead, TableHeader, TableRow } from '@carbon/react';
import React, { useEffect, useState } from 'react';

import styles from '../moh-745.scss';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { moh412Columns } from './type';
import { getMoh412PatientList } from '../../../resources/moh-745.resource';

const Moh412Register: React.FC = () => {
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

        const data = await getMoh412PatientList(params);

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
    navigate('/moh-745');
  }
  return (
    <>
      <div className={styles.buttonContainer}>
        <Button onClick={navigateBack}>Back</Button>
      </div>
      <div>{isLoading && <Loading />}</div>
      <div className={styles.tableContainer}>
        <Table className={classNames(`${styles.table}`, `${styles.tableBordered}`, `${styles.tableStriped}`)}>
          <TableHead>
            <TableRow>
              <TableHeader colSpan={3}>Month:</TableHeader>
              <TableHeader colSpan={2}>Year</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader colSpan={6}>CERVICAL CANCER</TableHeader>
              <TableHeader colSpan={3}>Breast Cancer</TableHeader>
              <TableHeader colSpan={2}>Colorectal Cancer</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
            <TableRow>
              <TableHeader colSpan={9}>Client Details</TableHeader>
              <TableHeader colSpan={3}>Screening Methods and Results</TableHeader>
              <TableHeader colSpan={3}>Pre-Cancer Treatment</TableHeader>
              <TableHeader colSpan={3}>Methods and Results</TableHeader>
              <TableHeader colSpan={2}>Methods and Results</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
            <TableRow>
              <TableHeader>
                a)S/No
                <br />
                No
              </TableHeader>
              <TableHeader>
                b)Visit <br />
                Date
              </TableHeader>
              <TableHeader>
                c)Visit <br />
                Type
              </TableHeader>
              <TableHeader>
                d)Client <br />
                No
              </TableHeader>
              <TableHeader>e)Client Names</TableHeader>
              <TableHeader>
                f)Client's Phone <br />
                Number
              </TableHeader>
              <TableHeader>
                g)Client's <br /> Age
              </TableHeader>
              <TableHeader>
                h)Location
                <br />
                Residence
              </TableHeader>
              <TableHeader>
                i)Treatment
                <br />
                Suppoter's Phone
                <br />
                Number
              </TableHeader>
              <TableHeader>
                j)Via or <br />
                VIA/VILLI
              </TableHeader>
              <TableHeader>
                k)Pap <br />
                Smear
              </TableHeader>
              <TableHeader>
                l)HPV Test
                <br />
                (over 30 years)
              </TableHeader>
              <TableHeader>m)cryotherapy</TableHeader>
              <TableHeader>
                n)Thermo-
                <br />
                ablation
              </TableHeader>
              <TableHeader>o)LEEP</TableHeader>
              <TableHeader>p)CBE</TableHeader>
              <TableHeader>q)Ultrasound</TableHeader>
              <TableHeader>r)Mammogram</TableHeader>
              <TableHeader>s)Colonoscopy</TableHeader>
              <TableHeader>t)FOBT</TableHeader>
              <TableHeader>u)HIV Status</TableHeader>
              <TableHeader>
                v)Referral <br />
                To/From
              </TableHeader>
              <TableHeader>
                w)Follow-
                <br />
                up Date
              </TableHeader>
              <TableHeader>
                Remarks(e.g Colposcopy done,
                <br />
                Cervicography results, Call
                <br />
                Client for follow up, Return for <br />
                post-treatment screening, <br />
                Communicate with the referral site)
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientlist?.length > 0 ? (
              patientlist.map((patient, index) => (
                <TableRow key={index}>
                  {moh412Columns.map((col) => (
                    <td key={col}>{col === 'serial_no' ? index + 1 : (patient?.[col] ?? '')}</td>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={moh412Columns.length}>No data available</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default Moh412Register;
