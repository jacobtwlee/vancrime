from django.shortcuts import render
from django.http import Http404
from .models import Crime
# from .forms import CrimeForm
from bokeh.plotting import figure, output_file, show
from bokeh.embed import components
from bokeh.resources import CDN
from math import pi 
import calendar

# Create your views here.

def index(request):
    crime_list = Crime.objects.all()[:5]
    context = {'crime_list': crime_list}
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
        graph = figure(x_range = list(dat.index), x_axis_label = "Month", y_axis_label = "Number of Crimes", width = 1200, title = title)
        graph.line(list(dat.index), dat["All Crimes"]) 
        graph.xaxis.major_label_orientation = - pi/2
        script, div = components(graph, CDN)
        return render(request, 'vancrime/crime_bar_graph.html', {'the_script': script, 'the_div': div})
     except IndexError:
        raise Http404("Invalid month entered.")
