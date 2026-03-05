def chunked(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i:i + size]