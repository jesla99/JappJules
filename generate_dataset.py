
import json
import os
import random
import re

def read_docs(paths):
    """Reads the content of all markdown files in the given paths."""
    docs = {}
    for path in paths:
        for root, _, files in os.walk(path):
            for file in files:
                if file.endswith(".md"):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, "r", encoding="utf-8") as f:
                            docs[filepath] = f.read()
                    except Exception as e:
                        print(f"Error reading {filepath}: {e}")
    return docs

def extract_all_from_docs(docs, pattern, flags=0):
    """Extracts all occurrences of a pattern from all documents."""
    all_matches = []
    for content in docs.values():
        matches = re.findall(pattern, content, flags)
        all_matches.extend(matches)
    return all_matches

def generate_code_creation_entry(all_code_blocks):
    """Generates a code creation entry from a pool of all code blocks."""
    if not all_code_blocks:
        return None

    code_snippet = random.choice(all_code_blocks)
    component_name = "Componente"  # Default

    class_match = re.search(r"class\s+([A-Z]\w*)", code_snippet)
    func_match = re.search(r"function\s+([A-Z]\w*)", code_snippet)

    if class_match:
        component_name = class_match.group(1)
    elif func_match:
        component_name = func_match.group(1)

    user_content = f"Muéstrame un ejemplo de cómo crear un componente o función `{component_name}` en JappN."
    assistant_content = (
        f"Claro, aquí tienes un ejemplo de cómo se podría definir `{component_name}` en JappN. "
        "Este fragmento de código ilustra el uso de las convenciones del framework, como el método `alCargar` en las clases.\n\n"
        f"```javascript\n{code_snippet.strip()}\n```"
    )

    return {"messages": [{"role": "user", "content": user_content}, {"role": "assistant", "content": assistant_content}]}

def generate_conceptual_help_entry(all_concepts):
    """Generates a conceptual help entry from a pool of all concepts."""
    if not all_concepts:
        return None

    # Filter for concepts with a meaningful body length
    valid_concepts = [c for c in all_concepts if len(c[1].strip()) > 50]
    if not valid_concepts:
        return None # Return None if no substantial concepts are found

    concept_title, concept_body = random.choice(valid_concepts)

    concept_body = re.sub(r"\[<.*?\].*?\n", "", concept_body).strip()
    concept_body = re.sub(r"\n{2,}", "\n\n", concept_body)

    user_content = f"¿Puedes explicarme el concepto de '{concept_title.strip()}' en JappN?"
    assistant_content = (
        f"En JappN, '{concept_title.strip()}' se explica de la siguiente manera:\n\n{concept_body}"
    )

    return {"messages": [{"role": "user", "content": user_content}, {"role": "assistant", "content": assistant_content}]}

def generate_anti_react_syntax_entry(docs):
    """Generates a dynamic anti-React syntax entry by finding relevant examples."""
    class_pattern = r"(<[a-zA-Z0-9]+[^>]*\sclass\s*=\s*['\"].*?['\"].*?>)"
    alcargar_pattern = r"alCargar\s*\((.*?)\)\s*\{"

    class_matches = extract_all_from_docs(docs, class_pattern)
    alcargar_matches = extract_all_from_docs(docs, alcargar_pattern)

    choice = random.choice(['class', 'alcargar']) if class_matches and alcargar_matches else ('class' if class_matches else ('alcargar' if alcargar_matches else None))

    if choice == 'class':
        example = random.choice(class_matches)
        user_content = "¿Qué atributo se usa para las clases CSS en JSX dentro de JappN?"
        assistant_content = (
            "En JappN, se utiliza el atributo `class` para asignar clases CSS a los elementos JSX, a diferencia de React que utiliza `className`.\n\n"
            "Por ejemplo, así es como se define una clase en JappN:\n"
            f"```html\n{example}\n```"
        )
    elif choice == 'alcargar':
        example = f"alCargar({random.choice(alcargar_matches)}) {{ ... }}"
        user_content = "¿Cuál es el método principal del ciclo de vida en los componentes de clase de JappN?"
        assistant_content = (
            "El método principal del ciclo de vida en los componentes de clase de JappN es `alCargar`. Es el punto de entrada que el framework busca para renderizar el componente.\n\n"
            "Un ejemplo de su firma es:\n"
            f"```javascript\n{example}\n```"
        )
    else:
        return None

    return {"messages": [{"role": "user", "content": user_content}, {"role": "assistant", "content": assistant_content}]}

def generate_dataset(docs, num_entries, precomputed_data):
    """Generates a dataset with the specified number of entries."""
    dataset = []

    all_code_blocks = precomputed_data['code']
    all_concepts = precomputed_data['concepts']

    generation_functions = [
        lambda: generate_code_creation_entry(all_code_blocks),
        lambda: generate_conceptual_help_entry(all_concepts),
        lambda: generate_anti_react_syntax_entry(docs)
    ]

    if not all_code_blocks or not all_concepts:
        print("Warning: Not enough diverse data to generate from.")
        return []

    for i in range(num_entries):
        gen_func = generation_functions[i % len(generation_functions)]
        entry = gen_func()
        if entry:
            dataset.append(entry)
        else:
            # Try another generator if one fails
            backup_func = random.choice(generation_functions)
            entry = backup_func()
            if entry:
                dataset.append(entry)

    # If we still don't have enough, fill with random valid entries
    while len(dataset) > 0 and len(dataset) < num_entries:
        dataset.append(random.choice(dataset))

    return dataset

def main():
    """Main function to generate the datasets."""
    doc_paths = ["docu"]
    docs = read_docs(doc_paths)

    precomputed_data = {
        'code': extract_all_from_docs(docs, r"```(?:javascript|js|tsx)\n(.*?)\n```", re.DOTALL),
        'concepts': extract_all_from_docs(docs, r"^#+\s(.*?)\n([\s\S]*?)(?=\n^#+|$)", re.MULTILINE)
    }

    # Generate training dataset
    train_dataset = generate_dataset(docs, 1000, precomputed_data)
    with open("train.jsonl", "w", encoding="utf-8") as f:
        for entry in train_dataset:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    # Generate validation dataset
    valid_dataset = generate_dataset(docs, 100, precomputed_data)
    with open("valid.jsonl", "w", encoding="utf-8") as f:
        for entry in valid_dataset:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print(f"Datasets generados exitosamente. {len(train_dataset)} entradas de entrenamiento, {len(valid_dataset)} entradas de validación.")

if __name__ == "__main__":
    main()
