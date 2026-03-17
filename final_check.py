import json

path = '/Users/xuchu/云同步开发项目/SoulBuilder/soulbuilder_payload_v6.js'
content = open(path).read()

# Check for SCENARIO_DATA
if 'const SCENARIO_DATA =' in content:
    print('✅ SCENARIO_DATA found.')
else:
    print('❌ SCENARIO_DATA MISSING.')

# Check for DOCS_DATA
if 'const DOCS_DATA =' in content:
    print('✅ DOCS_DATA found.')
else:
    print('❌ DOCS_DATA MISSING.')

# Check for GROUPS_DATA
if 'const GROUPS_DATA =' in content:
    print('✅ GROUPS_DATA found.')
else:
    print('❌ GROUPS_DATA MISSING.')

# Check for Ultimate Trumind in Payload
if '18. 画像：Trumind (CEO 影子分身与永生心智) —— 终极整合版' in content:
    print('✅ Ultimate Trumind found in Payload.')
else:
    print('❌ Ultimate Trumind MISSING in Payload.')

# Check for Ultimate Leo in Payload
if '23. 画像：Leo（AI 技术专家） —— 终极学术与实战整合版' in content:
    print('✅ Ultimate Leo found in Payload.')
else:
    print('❌ Ultimate Leo MISSING in Payload.')

# Check for 01-04 docs in Meta group (physically in GROUPS_DATA string)
import re
groups_match = re.search(r'const GROUPS_DATA = (\{.*?\});', content, re.DOTALL)
if groups_match:
    groups = json.loads(groups_match.group(1))
    meta_ids = [d['id'] for d in groups.get('Meta', [])]
    found_01 = '01. 团队：我的AI团队.md' in meta_ids
    found_02 = '02. 人类：认识一堂公司.md' in meta_ids
    if found_01 and found_02:
        print('✅ 01/02 docs correctly mapped to Meta group.')
    else:
        print(f'❌ 01/02 mapping issue. Found 01: {found_01}, Found 02: {found_02}')
else:
    print('❌ Could not parse GROUPS_DATA.')

