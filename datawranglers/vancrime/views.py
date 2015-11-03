from django.shortcuts import render
from django.http import Http404

from .models import Crime
import calendar

# Create your views here.

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
