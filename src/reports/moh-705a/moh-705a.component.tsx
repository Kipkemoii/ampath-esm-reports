import { useSession } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { getMoh705a } from '../../resources/moh-705.resource';

import styles from './moh-705a.scss';
import ReportFiltersComponent from '../../common/report-filters/report-filters.component';
import { Loading } from '@carbon/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { type ReportFilters } from './type';

const Moh705AComponent: React.FC = () => {
  let errorMessage: string = '';
  const [moh705aData, setMoh705aData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const session = useSession();
  const locationUuids = session?.sessionLocation?.uuid;
  const navigate = useNavigate();

  const getReportParams = (filters: ReportFilters) => {
    let { startDate: sDate, endDate: eDate } = filters;

    if (filters.month) {
      const [year, monthIndex] = filters.month.split('-').map(Number);

      const start = new Date(year, monthIndex - 1, 1);
      const end = new Date(year, monthIndex, 0);

      const formatLocalDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      sDate = formatLocalDate(start);
      eDate = formatLocalDate(end);
    }

    setStartDate(sDate || '');
    setEndDate(eDate || '');

    return { startDate: sDate, endDate: eDate };
  };

  const fetchMoh705bReportData = async (filters: { startDate?: string; endDate?: string; month?: string }) => {
    setIsLoading(true);

    const { startDate, endDate } = getReportParams(filters);

    const params = {
      locationUuids: locationUuids || '',
      startDate,
      endDate,
    };
    try {
      const data = await getMoh705a(params);
      const flatData = Object.assign({}, ...data.result);
      setMoh705aData(flatData);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch MOH-710 report data: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = (indicator: string) => {
    navigate(
      `/moh-204a?startDate=${startDate}&endDate=${endDate}&locationUuids=${locationUuids}&indicator=${indicator}`,
    );
  };

  return (
    <>
      <ReportFiltersComponent
        reportName="MOH-705A Report"
        mode="monthly"
        onGenerate={fetchMoh705bReportData}
        isLoding={isLoading}
      />
      {isLoading && <Loading description="Fetching data...." />}
      {!isLoading && errorMessage && (
        <div>
          <a href="#" className="close" data-dismiss="alert">
            &times;
          </a>
          <h4>
            <strong>
              <span className="glyphicon glyphicon-warning-sign"></span>{' '}
            </strong>{' '}
            An error occurred while trying to load the report. Please try again.
          </h4>
          <p>
            <small>{errorMessage}</small>
          </p>
        </div>
      )}
      <h3>KHIS Aggregate</h3>
      <div className={styles.container}>
        <table className={classNames(`${styles.table}`, `${styles.tableBordered}`, `${styles.tableStriped}`)}>
          <thead>
            <tr>
              <th colSpan={2}>DISEASES (New Cases Only)</th>
              <th>Number of Cases</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Diarrhoea with no dehydration</td>
              <td onClick={() => navigateToRegister('diarrhoea_with_no_dehydration')}>
                {moh705aData.diarrhoea_with_no_dehydration}
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Diarrhoea with some dehydration</td>
              <td onClick={() => navigateToRegister('diarrhoea_with_some_dehydration')}>
                {moh705aData.diarrhoea_with_some_dehydration}
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Diarrhoea with severe dehydration</td>
              <td onClick={() => navigateToRegister('diarrhoea_with_severe_dehydration')}>
                {moh705aData.diarrhoea_with_severe_dehydration}
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Cholera</td>
              <td onClick={() => navigateToRegister('cholera')}>{moh705aData.cholera}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Dysentary (Blood diarrhoea)</td>
              <td onClick={() => navigateToRegister('dysentry')}>{moh705aData.dysentry}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Gastroenterities</td>
              <td onClick={() => navigateToRegister('gastroenterities')}>{moh705aData.gastroenterities}</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Pneomonia</td>
              <td onClick={() => navigateToRegister('pneumonia')}>{moh705aData.pneumonia}</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Severe pneumonia</td>
              <td onClick={() => navigateToRegister('severe_pneumonia')}>{moh705aData.severe_pneumonia}</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Upper Respiratory Tract Infections</td>
              <td onClick={() => navigateToRegister('upper_respiratory_tract_infections')}>
                {moh705aData.upper_respiratory_tract_infections}
              </td>
            </tr>
            <tr>
              <td>10</td>
              <td>Lower Respiratory Tract Infections</td>
              <td onClick={() => navigateToRegister('lower_respiratory_tract_infections')}>
                {moh705aData.lower_respiratory_tract_infections}
              </td>
            </tr>
            <tr>
              <td>11</td>
              <td>Asthma</td>
              <td onClick={() => navigateToRegister('asthma')}>{moh705aData.asthma}</td>
            </tr>
            <tr>
              <td>12</td>
              <td>Presumed Tuberculosis</td>
              <td onClick={() => navigateToRegister('presumed_tuberculosis')}>{moh705aData.presumed_tuberculosis}</td>
            </tr>
            <tr>
              <td>13</td>
              <td>Suspected Malaria</td>
              <td onClick={() => navigateToRegister('suspected_malaria')}>{moh705aData.suspected_malaria}</td>
            </tr>
            <tr>
              <td>14</td>
              <td>Tested for Malaria</td>
              <td onClick={() => navigateToRegister('tested_for_malaria')}>{moh705aData.tested_for_malaria}</td>
            </tr>
            <tr>
              <td>15</td>
              <td>Confirmed malaria</td>
              <td onClick={() => navigateToRegister('confirmed_malaria')}>{moh705aData.confirmed_malaria}</td>
            </tr>
            <tr>
              <td>16</td>
              <td>Ear infection</td>
              <td onClick={() => navigateToRegister('ear_infection')}>{moh705aData.ear_infection}</td>
            </tr>
            <tr>
              <td>17</td>
              <td>Malnutrition</td>
              <td onClick={() => navigateToRegister('malnutrition')}>{moh705aData.malnutrition}</td>
            </tr>
            <tr>
              <td>18</td>
              <td>Anaemia</td>
              <td onClick={() => navigateToRegister('anaemia')}>{moh705aData.anaemia}</td>
            </tr>
            <tr>
              <td>19</td>
              <td>Meningococcal Menengitis</td>
              <td onClick={() => navigateToRegister('meningococcal_meningitis')}>
                {moh705aData.meningococcal_meningitis}
              </td>
            </tr>
            <tr>
              <td>20</td>
              <td>Other Meningitis</td>
              <td onClick={() => navigateToRegister('other_meningitis')}>{moh705aData.other_meningitis}</td>
            </tr>
            <tr>
              <td>21</td>
              <td>Neonatal Sepsis</td>
              <td onClick={() => navigateToRegister('neonatal_sepsis')}>{moh705aData.neonatal_sepsis}</td>
            </tr>
            <tr>
              <td>22</td>
              <td>Neonatal Tetanus</td>
              <td onClick={() => navigateToRegister('neonatal_tetanus')}>{moh705aData.neonatal_tetanus}</td>
            </tr>
            <tr>
              <td>23</td>
              <td>Poliomyelitis (AFP)</td>
              <td onClick={() => navigateToRegister('poliomyelitis')}>{moh705aData.poliomyelitis}</td>
            </tr>
            <tr>
              <td>24</td>
              <td>Chicken Pox</td>
              <td onClick={() => navigateToRegister('chicken_pox')}>{moh705aData.chicken_pox}</td>
            </tr>
            <tr>
              <td>25</td>
              <td>Measles</td>
              <td onClick={() => navigateToRegister('measles')}>{moh705aData.measles}</td>
            </tr>
            <tr>
              <td>26</td>
              <td>Hepatitis</td>
              <td onClick={() => navigateToRegister('hepatitis')}>{moh705aData.hepatitis}</td>
            </tr>
            <tr>
              <td>27</td>
              <td>Amoebiasis</td>
              <td onClick={() => navigateToRegister('amoebiasis')}>{moh705aData.amoebiasis}</td>
            </tr>
            <tr>
              <td>28</td>
              <td>Mumps</td>
              <td onClick={() => navigateToRegister('mumps')}>{moh705aData.mumps}</td>
            </tr>
            <tr>
              <td>29</td>
              <td>Typhoid fever</td>
              <td onClick={() => navigateToRegister('typhoid_fever')}>{moh705aData.typhoid_fever}</td>
            </tr>
            <tr>
              <td>30</td>
              <td>Bilharzia (Schistosomiasis)</td>
              <td onClick={() => navigateToRegister('bilharzia')}>{moh705aData.bilharzia}</td>
            </tr>
            <tr>
              <td>31</td>
              <td>Intestinal worms</td>
              <td onClick={() => navigateToRegister('intestinal_worms')}>{moh705aData.intestinal_worms}</td>
            </tr>
            <tr>
              <td>32</td>
              <td>Eye Infections</td>
              <td onClick={() => navigateToRegister('eye_infections')}>{moh705aData.eye_infections}</td>
            </tr>
            <tr>
              <td>33</td>
              <td>Tonsilitis</td>
              <td onClick={() => navigateToRegister('tonsilities')}>{moh705aData.tonsilities}</td>
            </tr>
            <tr>
              <td>34</td>
              <td>Urinary Tract Infection</td>
              <td onClick={() => navigateToRegister('urinary_tract_infections')}>
                {moh705aData.urinary_tract_infections}
              </td>
            </tr>
            <tr>
              <td>35</td>
              <td>Mental Disorders</td>
              <td onClick={() => navigateToRegister('mental_disorders')}>{moh705aData.mental_disorders}</td>
            </tr>
            <tr>
              <td>36</td>
              <td>Dental Disorders</td>
              <td onClick={() => navigateToRegister('dental_disorders')}>{moh705aData.dental_disorders}</td>
            </tr>
            <tr>
              <td>37</td>
              <td>Jiggers Infestation</td>
              <td onClick={() => navigateToRegister('jiggers_infestation')}>{moh705aData.jiggers_infestation}</td>
            </tr>
            <tr>
              <td>38</td>
              <td>Diseases fo the skin</td>
              <td onClick={() => navigateToRegister('diseases_of_the_skin')}>{moh705aData.diseases_of_the_skin}</td>
            </tr>
            <tr>
              <td>39</td>
              <td>Down's syndrome</td>
              <td onClick={() => navigateToRegister('downs_syndrome')}>{moh705aData.downs_syndrome}</td>
            </tr>
            <tr>
              <td>40</td>
              <td>Poisoning</td>
              <td onClick={() => navigateToRegister('poisoning')}>{moh705aData.poisoning}</td>
            </tr>
            <tr>
              <td>41</td>
              <td>Road Traffic Injuries</td>
              <td onClick={() => navigateToRegister('road_traffic_injuries')}>{moh705aData.road_traffic_injuries}</td>
            </tr>
            <tr>
              <td>42</td>
              <td>Deaths due to Road Traffic Injuries</td>
              <td onClick={() => navigateToRegister('deaths_due_to_road_traffic_injuries')}>
                {moh705aData.deaths_due_to_road_traffic_injuries}
              </td>
            </tr>
            <tr>
              <td>43</td>
              <td>Violence related injuries</td>
              <td onClick={() => navigateToRegister('violence_related_injuries')}>
                {moh705aData.violence_related_injuries}
              </td>
            </tr>
            <tr>
              <td>44</td>
              <td>Other injuries</td>
              <td onClick={() => navigateToRegister('other_injuries')}>{moh705aData.other_injuries}</td>
            </tr>
            <tr>
              <td>45</td>
              <td>Sexual Violence</td>
              <td onClick={() => navigateToRegister('sexual_violence')}>{moh705aData.sexual_violence}</td>
            </tr>
            <tr>
              <td>46</td>
              <td>Burns</td>
              <td onClick={() => navigateToRegister('burns')}>{moh705aData.burns}</td>
            </tr>
            <tr>
              <td>47</td>
              <td>Snake Bites</td>
              <td onClick={() => navigateToRegister('snake_bites')}>{moh705aData.snake_bites}</td>
            </tr>
            <tr>
              <td>48</td>
              <td>Dog bites</td>
              <td onClick={() => navigateToRegister('dog_bites')}>{moh705aData.dog_bites}</td>
            </tr>
            <tr>
              <td>49</td>
              <td>Other Bites</td>
              <td onClick={() => navigateToRegister('other_bites')}>{moh705aData.other_bites}</td>
            </tr>
            <tr>
              <td>50</td>
              <td>Diabetes</td>
              <td onClick={() => navigateToRegister('diabetes')}>{moh705aData.diabetes}</td>
            </tr>
            <tr>
              <td>51</td>
              <td>Epilepsy</td>
              <td onClick={() => navigateToRegister('epilepsy')}>{moh705aData.epilepsy}</td>
            </tr>
            <tr>
              <td>52</td>
              <td>Other Convulsive Disorders</td>
              <td onClick={() => navigateToRegister('other_convulsive_disorders')}>
                {moh705aData.other_convulsive_disorders}
              </td>
            </tr>
            <tr>
              <td>53</td>
              <td>Rheumatic Fever</td>
              <td onClick={() => navigateToRegister('rheumatic_fever')}>{moh705aData.rheumatic_fever}</td>
            </tr>
            <tr>
              <td>54</td>
              <td>Brucellosis</td>
              <td onClick={() => navigateToRegister('brucellosis')}>{moh705aData.brucellosis}</td>
            </tr>
            <tr>
              <td>55</td>
              <td>Rickets</td>
              <td onClick={() => navigateToRegister('rickets')}>{moh705aData.rickets}</td>
            </tr>
            <tr>
              <td>56</td>
              <td>Cerebral Palsy</td>
              <td onClick={() => navigateToRegister('cerebral_palsy')}>{moh705aData.cerebral_palsy}</td>
            </tr>
            <tr>
              <td>57</td>
              <td>Autism</td>
              <td onClick={() => navigateToRegister('autism')}>{moh705aData.autism}</td>
            </tr>
            <tr>
              <td>58</td>
              <td>Tryponosomiasis</td>
              <td onClick={() => navigateToRegister('tryponosomiasis')}>{moh705aData.tryponosomiasis}</td>
            </tr>
            <tr>
              <td>59</td>
              <td>Yellow Fever</td>
              <td onClick={() => navigateToRegister('yellow_fever')}>{moh705aData.yellow_fever}</td>
            </tr>
            <tr>
              <td>60</td>
              <td>Viral Haemorrhagic Fever</td>
              <td onClick={() => navigateToRegister('viral_haemorrhagic_fever')}>
                {moh705aData.viral_haemorrhagic_fever}
              </td>
            </tr>
            <tr>
              <td>61</td>
              <td>Rift valley fever</td>
              <td onClick={() => navigateToRegister('rift_valley_fever')}>{moh705aData.rift_valley_fever}</td>
            </tr>
            <tr>
              <td>62</td>
              <td>Chikungunya</td>
              <td onClick={() => navigateToRegister('chikungunya')}>{moh705aData.chikungunya}</td>
            </tr>
            <tr>
              <td>63</td>
              <td>Dengue fever</td>
              <td onClick={() => navigateToRegister('dengue_fever')}>{moh705aData.dengue_fever}</td>
            </tr>
            <tr>
              <td>64</td>
              <td>Leishmaniasis(Kalaazar)</td>
              <td onClick={() => navigateToRegister('leishmaniasis')}>{moh705aData.leishmaniasis}</td>
            </tr>
            <tr>
              <td>65</td>
              <td>Cutaneous leishmaniasis</td>
              <td onClick={() => navigateToRegister('cutaneous_leishmaniasis')}>
                {moh705aData.cutaneous_leishmaniasis}
              </td>
            </tr>
            <tr>
              <td>66</td>
              <td>Suspected anthrax</td>
              <td onClick={() => navigateToRegister('suspected_anthrax')}>{moh705aData.suspected_anthrax}</td>
            </tr>
            <tr>
              <td>67</td>
              <td>Suspected Childhood Cancers</td>
              <td onClick={() => navigateToRegister('suspected_childhood_cancers')}>
                {moh705aData.suspected_childhood_cancers}
              </td>
            </tr>
            <tr>
              <td>68</td>
              <td>Hypoxaemia (Spo2&lt;90%)</td>
              <td onClick={() => navigateToRegister('hypoxaemia')}>{moh705aData.hypoxaemia}</td>
            </tr>
            <tr>
              <td>69</td>
              <td>All Other Diseases</td>
              <td onClick={() => navigateToRegister('all_other_diseases')}>{moh705aData.all_other_diseases}</td>
            </tr>
            <tr>
              <td>70</td>
              <td>No. of New Attendances</td>
              <td onClick={() => navigateToRegister('new_attendances')}>{moh705aData.new_attendances}</td>
            </tr>
            <tr>
              <td>71</td>
              <td>No of Re-Attendances</td>
              <td onClick={() => navigateToRegister('re_attendances')}>{moh705aData.re_attendances}</td>
            </tr>
            <tr>
              <td>72</td>
              <td>Referrals From Other Health Facility</td>
              <td onClick={() => navigateToRegister('referrals_from_other_health_facility')}>
                {moh705aData.referrals_from_other_health_facility}
              </td>
            </tr>
            <tr>
              <td>73</td>
              <td>Referrals To Other Health Facility</td>
              <td onClick={() => navigateToRegister('referrals_to_other_health_facility')}>
                {moh705aData.referrals_to_other_health_facility}
              </td>
            </tr>
            <tr>
              <td>74</td>
              <td>Referrals From Community Unit</td>
              <td onClick={() => navigateToRegister('referrals_from_community_unit')}>
                {moh705aData.referrals_from_community_unit}
              </td>
            </tr>
            <tr>
              <td>74</td>
              <td>Referrals To Community Unit</td>
              <td onClick={() => navigateToRegister('referrals_to_community_unit')}>
                {moh705aData.referrals_to_community_unit}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Moh705AComponent;
