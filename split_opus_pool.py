import os
import re
from pprint import pprint

# Path to the file and base output directory
file_path = './book/docs/classes/OpusPool.md'
base_output_dir = './book/docs/classes/OpusPool/'

# Read the file content
with open(file_path, 'r') as file:
    content = file.read()

# Drop everything before section "## Properties"
content = re.sub(r'^.*## Properties', 'Properties', content, flags=re.DOTALL)

# Remove all horizontal lines ('---')
content = re.sub(r'\n---\n', '\n', content)
content = re.sub(r'\n___\n', '\n', content)


# Create a dictionary to store section contents
sections = re.split(r'\n## ', content)


section_dict = {}
for section in sections:
    if section.strip():
        section_title = section.split('\n', 1)[0].strip()
        section_content = section.split('\n', 1)[1].strip()
        if section_title == 'Constructors':
            section_title = 'Constructor'
        section_dict[section_title] = section_content



# Function to create directories and files
def create_files(section_title, section_content):
    section_path = os.path.join(base_output_dir, section_title)
    os.makedirs(section_path, exist_ok=True)

    clean_section_content = re.sub(r'^### ', '', section_content)
    sub_sections = re.split(r'\n### ', clean_section_content)

    for sub_section in sub_sections:
        if sub_section.strip():
            sub_section_title = sub_section.split('\n', 1)[0].strip()
            sub_section_content = '### ' + sub_section.strip()
            file_path = os.path.join(section_path, f'{sub_section_title}.md')
            with open(file_path, 'w') as file:
                file.write(sub_section_content)

# Create folders and files for each section
for section_title, section_content in section_dict.items():
    create_files(section_title, section_content)

print("Files created successfully.")
