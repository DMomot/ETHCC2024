import re
from typing import Annotated

from annotated_types import Len, Predicate

AddressType = Annotated[str, Len(min_length=42, max_length=42), Predicate(re.compile("^0x[0-9a-fA-F]*$").search)]
