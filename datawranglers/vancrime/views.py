from django.shortcuts import render
# from django.http import HttpResponse

from .models import Crime

# Create your views here.

def index(request):
    crime_list = Crime.objects.all()[:5]
    context = {'crime_list': crime_list}
    return render(request, 'vancrime/index.html', context)