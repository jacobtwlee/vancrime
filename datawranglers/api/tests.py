import json
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User

from vancrime.models import Crime
from vancrime.models import Location
from vancrime.models import LoadedData

from api.views import FetchDataView

class FetchDataViewTests(TestCase):
    def setUp(self):
        # create an admin user to run the tests
        User.objects.create_superuser('test', '', 'test')
        self.client = Client()
        self.client.login(username="test",password="test")
        
        # mock data
        self.TEST_DATA_URL_2015 = "http://vancrime.me/static/vancrime/testdata/crime_2015.csv"
        self.TEST_DATA_URL_2014 = "http://vancrime.me/static/vancrime/testdata/crime_2014.csv"
        FetchDataView.REMOTE_DATA_URLS = {2015: self.TEST_DATA_URL_2015, 2014: self.TEST_DATA_URL_2014}
    
    def test_post(self):
        """
        Tests fetching and parsing data into the database
        """    
        response = self.client.post('/ajax/fetch-data', data=json.dumps({'years': [2015,2014]}), content_type='application/json')
    
        self.assertEqual(response.status_code, 200)
        # self.assertJSONEqual(str(response.content, encoding='utf8'), {'success': True, 'newData': [TEST_DATA_URL_2014, TEST_DATA_URL_2015]})
        
        """
        Verify locations loaded into database
        """
        locations = Location.objects
        
        # assert locations inserted correctly
        self.assertEqual(locations.count(), 3)
        
        # assert locations have correct values
        self.assertEqual(locations.filter(address="1XX 1ST ST").count(), 1)
        self.assertEqual(locations.filter(address="2XX 2ND ST").count(), 1)
        self.assertEqual(locations.filter(address="3XX 3RD ST").count(), 1)
        
        """
        Verify crimes loaded into database
        """
        crimes = Crime.objects
        
        location1 = locations.get(address="1XX 1ST ST")
        location2 = locations.get(address="2XX 2ND ST")
        location3 = locations.get(address="3XX 3RD ST")
        
        # assert sure crimes were inserted correctly
        self.assertEqual(crimes.count(), 6)
        self.assertEqual(crimes.filter(year=2015).count(), 3)
        self.assertEqual(crimes.filter(year=2014).count(), 3)
        
        # assert crimes have correct values
        self.assertEqual(crimes.filter(crime_type="CRIME_TYPE_1", month=1, location=location1).count(), 2)
        self.assertEqual(crimes.filter(crime_type="CRIME_TYPE_2", month=2, location=location2).count(), 2)
        self.assertEqual(crimes.filter(crime_type="CRIME_TYPE_3", month=3, location=location3).count(), 2)
        
        """
        Verify loaded data entries updated
        """
        loaded_data = LoadedData.objects
        loaded_data_2015 = loaded_data.filter(url=self.TEST_DATA_URL_2015)
        loaded_data_2014 = loaded_data.filter(url=self.TEST_DATA_URL_2014)
        
        # assert loaded data updated with proper value
        self.assertEqual(loaded_data_2015.count(), 1)
        self.assertEqual(loaded_data_2014.count(), 1)
    
    def test_delete(self):        
        # first add some data to the database
        response = self.client.post('/ajax/fetch-data', data=json.dumps({'years': [2015,2014]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        # make sure data was added
        self.assertEqual(Crime.objects.all().count(), 6)
        self.assertEqual(Location.objects.all().count(), 3)
        self.assertEqual(LoadedData.objects.all().count(), 2)
        
        # delete the data
        response = self.client.delete('/ajax/fetch-data', data=json.dumps({'years': [2015,2014]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        self.assertEqual(Crime.objects.all().count(), 0)
        self.assertEqual(Location.objects.all().count(), 3) # locations are not deleted
        self.assertEqual(LoadedData.objects.all().count(), 0)
