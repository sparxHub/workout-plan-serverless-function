import os
import argparse

# Create command-line argument parser
parser = argparse.ArgumentParser(description="List files in the current directory with a specified prefix.")
parser.add_argument("output_param", help="Parameter to output the prefixed file names")

# Parse command-line arguments
args = parser.parse_args()

# Get a list of all files in the current working directory
files = os.listdir()

# Prefix for the files
prefix = "https://jbuwdk1d7uenrxyq.public.blob.vercel-storage.com/html/images/"

# Add the prefix to each file name
prefixed_files = [prefix + file for file in files]

# Output the prefixed file names as a parameter
output_param = ";".join(prefixed_files)

print(f"Prefixed file names: {output_param}")

# You can access the prefixed file names with 'args.output_param' in your script
