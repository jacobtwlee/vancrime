from django.db import models

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

class LoadedData(models.Model):
    url = models.URLField(max_length=200, unique=True)
