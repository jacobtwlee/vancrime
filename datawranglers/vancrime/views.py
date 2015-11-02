from django.shortcuts import render

from .models import Crime
import calendar

# Create your views here.

def summary_index(request):
    all_crimes = Crime.count_all_crimes_by_type()
    ## Add total here?
    context = {'all_crimes': all_crimes}
    return render(request, 'vancrime/summary_table.html', context)

def summary_date(request, month, year):
    month = int(month)
    year = int(year)
    all_crimes = Crime.count_crimes_by_time_type(year,month)
    total = Crime.count_crimes_by_time(year,month)
    month = calendar.month_name[month]
    context = {'all_crimes': all_crimes, 'total': total, 'month': month, 'year': year}
    return render(request, 'vancrime/summary_table.html', context)
