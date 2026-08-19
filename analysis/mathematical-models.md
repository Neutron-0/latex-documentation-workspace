# Mathematical Models: Entity Resolution

The entity resolution framework in Wolverine employs a deterministic, weighted scoring model rather than machine learning or Natural Language Processing (NLP).

## 1. Similarity Scoring Model

The final similarity score $S$ between two entity records $e_i$ and $e_j$ is calculated as a weighted sum of individual feature similarity scores:

$$S(e_i, e_j) = w_a \cdot sim_{alias} + w_d \cdot sim_{disp} + w_t \cdot sim_{temp} + w_o \cdot sim_{overlap} + w_c \cdot sim_{cue}$$

### 1.1 Weights
The weights are statically assigned in the implementation as follows:
- $w_a$ (Alias Similarity): 0.30
- $w_d$ (Display Name Similarity): 0.15
- $w_t$ (Temporal Proximity): 0.20
- $w_o$ (Activity Overlap): 0.15
- $w_c$ (Cross-site Cue): 0.20

### 1.2 String Similarity (Jaro-Winkler)
For string-based features (alias and display name), the system uses the Jaro-Winkler distance metric.

$$sim_{alias} = JaroWinkler(e_i.alias, e_j.alias)$$
$$sim_{disp} = JaroWinkler(e_i.display\_name, e_j.display\_name)$$

## 2. Heuristic Limitations (Implementation Reality)

While the theoretical model implies dynamic calculation of all features, the actual codebase relies on significant heuristic shortcuts. These limitations are critical to understanding the system's true capabilities:

### 2.1 Activity Overlap ($sim_{overlap}$)
Activity overlap is not dynamically computed based on behavior patterns. It is **hardcoded to 0.5** in the implementation.
$$sim_{overlap} = 0.5$$

### 2.2 Cross-site Cues ($sim_{cue}$)
Cross-site cue similarity is a binary indicator rather than a semantic match. It uses a **4-character string prefix match** without any Natural Language Processing (NLP) or vocabulary fingerprinting.
$$sim_{cue} = \begin{cases} 1 & \text{if } e_i.cue[0:4] == e_j.cue[0:4] \\ 0 & \text{otherwise} \end{cases}$$

## 3. Classification Threshold

Entities are considered a match (representing the same underlying identity) if the total score $S$ exceeds a predefined threshold $\tau$.
