from django.shortcuts import render

from .models import Crime

# Create your views here.

def summary_index(request):
    all_crimes = Crime.count_all_crimes_by_type()
    context = {'all_crimes': all_crimes}
    return render(request, 'vancrime/summary_table.html', context)

# def summary_date(request):
