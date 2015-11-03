from django.contrib import admin
from vancrime.models import Crime, Location, LoadedData

class CrimeAdmin( admin.ModelAdmin ):
    list_display = ('crime_type','location','year','month')

class LocationAdmin( admin.ModelAdmin ):
    list_display = ('address','latitude','longitude')

admin.site.register( Crime, CrimeAdmin )
admin.site.register( Location, LocationAdmin )
admin.site.register( LoadedData )



# Register your models here.
