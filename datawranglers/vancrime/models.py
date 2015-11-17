from django.db import models
import pandas
import calendar
from django.contrib.auth.models import User

class Favorites(models.Model):
    name = models.CharField(max_length=100, unique=True)    
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    def __str__(self):
        return self.name

class VanCrimeUser(models.Model):
    user = models.OneToOneField(User)
    favorites = models.ManyToManyField(Favorites)
    def __str__(self):
        return user.get_username()

class Location(models.Model):
    address = models.CharField(max_length=100, unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    def __str__(self):
        return self.address

class Crime(models.Model):
    crime_type = models.CharField(max_length=100)
    year = models.IntegerField()
    month = models.IntegerField()
    location = models.ForeignKey(Location)
    
    @staticmethod
    def count_crimes_by_time(y,m):
        return Crime.objects.filter(year=y,month=m).count()
    
    def sort_by_type(obj):
        types = obj.order_by().values('crime_type').distinct()
        d = dict()
        for t in types:
            num = obj.filter(crime_type=t['crime_type']).count()
            d[t['crime_type']] = num
        return d

    @staticmethod
    def count_crimes_by_time_type(y,m):
        crimes = Crime.objects.filter(year=y,month=m)
        return Crime.sort_by_type(crimes)

    @staticmethod
    def count_all_crimes_by_type():
        obj = Crime.objects.all()
        return Crime.sort_by_type(obj)

    @staticmethod
    def data_summary(year,month,num_months):
       all_data = []
       months = []
       while num_months > 0:
             crime_summary = Crime.count_crimes_by_time_type(year,month)
             month_name = calendar.month_name[month]
             all_data.append(crime_summary)
             months.append(month_name + " " + str(year))
             if month == 12:
                year += 1
                month = 1
             else:
                month += 1
             num_months -= 1
       summary = pandas.DataFrame(all_data, index = months)
       summary['All Crimes'] = summary.sum(axis=1)
       return summary
  
class LoadedData(models.Model):
    url = models.URLField(max_length=200, unique=True)
