from django.shortcuts import render
from django.http import Http404
from .models import Crime
# from .forms import CrimeForm
from bokeh.plotting import figure, output_file, show
from bokeh.embed import components
from bokeh.resources import CDN
from math import pi 
import calendar
import re

# Create your views here.

def index(request):
    crimes = Crime.objects.all()
    
    latestYear = crimes.order_by("-year")[0].year
    latestMonth = crimes.filter(year=latestYear).order_by("-month")[0].month
    
    distinctYears = crimes.values_list('year', flat=True).distinct()
    distinctMonths = crimes.values_list('month', flat=True).distinct()
    
    latitude = request.GET.get("lat")
    longitude = request.GET.get("lng")
    year = request.GET.get("year")
    month = request.GET.get("month")
    
    isYearValid = (year not in distinctYears) and (month not in distinctMonths)
    
    if (year is None) or (month is None) or (not isYearValid):
        year = latestYear
        month = latestMonth
        
    if (latitude is None) or (longitude is None):
        latitude = "null"
        longitude = "null"
    else:
        isLatitudeValid = re.match("^-?\d{2}\.\d{6}$", latitude) != None
        isLongitudeValid = re.match("^-?\d{2,3}\.\d{6}$", longitude) != None
        if not(isLatitudeValid and isLongitudeValid):
            latitude = "null"
            longitude = "null"
    
    context = {
        "default_year": year,
        "default_month": month,
        "default_latitude": latitude,
        "default_longitude": longitude
    }
    
    return render(request, 'vancrime/index.html', context)

def summary_index(request):
    all_crimes = Crime.count_all_crimes_by_type()
    total = Crime.objects.count()
    context = {'all_crimes': all_crimes, "total": total}
    return render(request, 'vancrime/summary_table.html', context)

def summary_date(request, month, year):
    month = int(month)
    year = int(year)
    try :
       all_crimes = Crime.count_crimes_by_time_type(year,month)
       total = Crime.count_crimes_by_time(year,month)
       month = calendar.month_name[month]
       context = {'all_crimes': all_crimes, 'total': total, 'month': month, 'year': year}
    except IndexError:
       raise Http404("Invalid month entered.")
    return render(request, 'vancrime/summary_table.html', context)

def graph(request,month, year):
     month = int(month)
     year = int(year)
     try:
        dat = Crime.data_summary(year,month,12)
        title = '12-month crime trend since ' + calendar.month_name[month] + ' ' + str(year)
        graph = figure(x_range = list(dat.index), x_axis_label = "Month", y_axis_label = "Number of Crimes", width = 1200, title = title, tools="pan,wheel_zoom,box_zoom,reset,save")
        graph.line(list(dat.index), dat["All Crimes"]) 
        graph.xaxis.major_label_orientation = - pi/2
        script, div = components(graph, CDN)
        return render(request, 'vancrime/crime_summary_graph.html', {'the_script': script, 'the_div': div})
     except IndexError:
        raise Http404("Invalid month entered.")
