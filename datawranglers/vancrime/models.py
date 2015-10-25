from django.db import models

class Location(models.Model):
    address = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

class Crime(models.Model):
    crime_type = models.CharField(max_length=100)
    year = models.IntegerField()
    month = models.IntegerField()
    location = models.ForeignKey(Location)
